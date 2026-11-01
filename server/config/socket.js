const Show = require('../models/Show');

// Active seat release timers: key = `${showId}_${seatId}` -> NodeJS.Timeout
const seatTimers = new Map();
// Socket to show and seats mapping for auto-cleanup on disconnect
const socketLocks = new Map(); // socket.id -> { showId, userId, seatIds: Set }

const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function initSocket(io) {
  io.on('connection', (socket) => {
    // 1. Join Show Room
    socket.on('join_show', async ({ showId }) => {
      if (!showId) return;
      socket.join(`show_${showId}`);

      try {
        const show = await Show.findById(showId).select('seatLayout');
        if (show) {
          const now = Date.now();
          // Auto clean any expired locked seats in database
          let updated = false;
          show.seatLayout.forEach((seat) => {
            if (seat.status === 'locked' && seat.lockedAt) {
              const elapsed = now - new Date(seat.lockedAt).getTime();
              if (elapsed > LOCK_DURATION_MS) {
                seat.status = 'available';
                seat.lockedBy = null;
                seat.lockedAt = null;
                updated = true;
              }
            }
          });
          if (updated) {
            await show.save();
          }
          socket.emit('seats_initial_state', {
            seatLayout: show.seatLayout
          });
        }
      } catch (err) {
        console.error('Error in join_show:', err.message);
      }
    });

    // 2. Leave Show Room
    socket.on('leave_show', ({ showId }) => {
      if (showId) socket.leave(`show_${showId}`);
    });

    // 3. Lock Seats (5-minute hold)
    socket.on('lock_seats', async ({ showId, seatIds, userId }, callback) => {
      if (!showId || !seatIds || !seatIds.length) {
        if (typeof callback === 'function') callback({ success: false, message: 'Invalid data' });
        return;
      }

      try {
        const show = await Show.findById(showId);
        if (!show) {
          if (typeof callback === 'function') callback({ success: false, message: 'Show not found' });
          return;
        }

        const now = new Date();
        const conflictSeats = [];

        seatIds.forEach((seatId) => {
          const seat = show.seatLayout.find((s) => s.seatId === seatId);
          if (!seat) {
            conflictSeats.push(seatId);
          } else if (seat.status === 'booked') {
            conflictSeats.push(seatId);
          } else if (seat.status === 'locked') {
            const elapsed = Date.now() - new Date(seat.lockedAt).getTime();
            if (elapsed < LOCK_DURATION_MS && String(seat.lockedBy) !== String(userId)) {
              conflictSeats.push(seatId);
            }
          }
        });

        if (conflictSeats.length > 0) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: `Seats ${conflictSeats.join(', ')} are no longer available.`
            });
          }
          return;
        }

        // Apply lock
        seatIds.forEach((seatId) => {
          const seat = show.seatLayout.find((s) => s.seatId === seatId);
          if (seat) {
            seat.status = 'locked';
            seat.lockedBy = userId;
            seat.lockedAt = now;

            // Timer management
            const timerKey = `${showId}_${seatId}`;
            if (seatTimers.has(timerKey)) {
              clearTimeout(seatTimers.get(timerKey));
            }
            const timer = setTimeout(async () => {
              try {
                const refreshedShow = await Show.findById(showId);
                if (refreshedShow) {
                  const targetSeat = refreshedShow.seatLayout.find((s) => s.seatId === seatId);
                  if (targetSeat && targetSeat.status === 'locked') {
                    targetSeat.status = 'available';
                    targetSeat.lockedBy = null;
                    targetSeat.lockedAt = null;
                    await refreshedShow.save();
                    io.to(`show_${showId}`).emit('seats_released', { seatIds: [seatId] });
                  }
                }
              } catch (e) {
                console.error('Error auto-releasing seat:', e.message);
              }
              seatTimers.delete(timerKey);
            }, LOCK_DURATION_MS);

            seatTimers.set(timerKey, timer);
          }
        });

        await show.save();

        // Track socket mapping
        if (!socketLocks.has(socket.id)) {
          socketLocks.set(socket.id, { showId, userId, seatIds: new Set() });
        }
        seatIds.forEach((id) => socketLocks.get(socket.id).seatIds.add(id));

        // Broadcast to everyone else in this show
        socket.to(`show_${showId}`).emit('seats_locked', {
          seatIds,
          lockedBy: userId
        });

        if (typeof callback === 'function') {
          callback({
            success: true,
            expiresInSeconds: 300,
            seatIds
          });
        }
      } catch (err) {
        console.error('Error locking seats:', err.message);
        if (typeof callback === 'function') {
          callback({ success: false, message: 'Server error locking seats' });
        }
      }
    });

    // 4. Manually Unlock Seats
    socket.on('unlock_seats', async ({ showId, seatIds, userId }, callback) => {
      if (!showId || !seatIds || !seatIds.length) return;

      try {
        const show = await Show.findById(showId);
        if (!show) return;

        seatIds.forEach((seatId) => {
          const seat = show.seatLayout.find((s) => s.seatId === seatId);
          if (seat && (String(seat.lockedBy) === String(userId) || !userId)) {
            seat.status = 'available';
            seat.lockedBy = null;
            seat.lockedAt = null;

            const timerKey = `${showId}_${seatId}`;
            if (seatTimers.has(timerKey)) {
              clearTimeout(seatTimers.get(timerKey));
              seatTimers.delete(timerKey);
            }
          }
        });

        await show.save();

        if (socketLocks.has(socket.id)) {
          seatIds.forEach((id) => socketLocks.get(socket.id).seatIds.delete(id));
        }

        io.to(`show_${showId}`).emit('seats_released', { seatIds });

        if (typeof callback === 'function') callback({ success: true });
      } catch (err) {
        console.error('Error unlocking seats:', err.message);
      }
    });

    // 5. On Disconnect
    socket.on('disconnect', async () => {
      const lockInfo = socketLocks.get(socket.id);
      if (lockInfo && lockInfo.seatIds.size > 0) {
        // We let the 5-minute timer continue in case user reloads or navigates,
        // or release immediately if desired. Continuing timer gives user reload resilience!
      }
      socketLocks.delete(socket.id);
    });
  });

  return io;
}

function notifySeatsBooked(io, showId, seatIds) {
  if (!io || !showId || !seatIds) return;
  // Clear any timers for these seats
  seatIds.forEach((seatId) => {
    const timerKey = `${showId}_${seatId}`;
    if (seatTimers.has(timerKey)) {
      clearTimeout(seatTimers.get(timerKey));
      seatTimers.delete(timerKey);
    }
  });

  io.to(`show_${showId}`).emit('seats_booked', { seatIds });
}

function notifySeatsReleased(io, showId, seatIds) {
  if (!io || !showId || !seatIds) return;
  seatIds.forEach((seatId) => {
    const timerKey = `${showId}_${seatId}`;
    if (seatTimers.has(timerKey)) {
      clearTimeout(seatTimers.get(timerKey));
      seatTimers.delete(timerKey);
    }
  });

  io.to(`show_${showId}`).emit('seats_released', { seatIds });
}

module.exports = { initSocket, notifySeatsBooked, notifySeatsReleased };

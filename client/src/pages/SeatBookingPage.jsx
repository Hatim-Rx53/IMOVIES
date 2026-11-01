import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShowById, updateSeatState, setFullSeatLayout } from '../store/slices/showSlice';
import { toggleSeatSelection, clearSelectedSeats, setLockTimer } from '../store/slices/bookingSlice';
import { getSocket } from '../services/socket';
import SeatGrid from '../components/booking/SeatGrid';
import SeatLegend from '../components/booking/SeatLegend';
import TimerBadge from '../components/booking/TimerBadge';

export default function SeatBookingPage() {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentShow: show, loading, error } = useSelector((state) => state.shows);
  const { selectedSeats, lockExpiresAt } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    dispatch(fetchShowById(showId));
    dispatch(clearSelectedSeats());

    const socket = getSocket();
    socket.emit('join_show', { showId });

    socket.on('seats_initial_state', ({ seatLayout }) => {
      dispatch(setFullSeatLayout(seatLayout));
    });

    socket.on('seats_locked', ({ seatIds, lockedBy }) => {
      dispatch(updateSeatState({ seatIds, status: 'locked', lockedBy }));
    });

    socket.on('seats_released', ({ seatIds }) => {
      dispatch(updateSeatState({ seatIds, status: 'available', lockedBy: null }));
    });

    socket.on('seats_booked', ({ seatIds }) => {
      dispatch(updateSeatState({ seatIds, status: 'booked' }));
    });

    return () => {
      socket.emit('leave_show', { showId });
      socket.off('seats_initial_state');
      socket.off('seats_locked');
      socket.off('seats_released');
      socket.off('seats_booked');
    };
  }, [dispatch, showId]);

  const handleToggleSeat = (seat) => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const socket = getSocket();
    const isCurrentlySelected = selectedSeats.some((s) => s.seatId === seat.seatId);

    if (isCurrentlySelected) {
      // Unlock seat
      dispatch(toggleSeatSelection(seat));
      socket.emit('unlock_seats', {
        showId,
        seatIds: [seat.seatId],
        userId: user._id
      });
    } else {
      // Maximum 8 seats per booking
      if (selectedSeats.length >= 8) {
        setSocketError('Maximum 8 tickets allowed per transaction.');
        return;
      }
      setSocketError(null);

      // Lock seat via Socket.io
      socket.emit(
        'lock_seats',
        {
          showId,
          seatIds: [seat.seatId],
          userId: user._id
        },
        (response) => {
          if (response && response.success) {
            dispatch(toggleSeatSelection(seat));
            // Set 5-minute countdown timer
            const expireTime = Date.now() + (response.expiresInSeconds || 300) * 1000;
            dispatch(setLockTimer(expireTime));
          } else {
            setSocketError(response?.message || 'Seat could not be selected');
          }
        }
      );
    }
  };

  const handleTimerExpire = () => {
    dispatch(clearSelectedSeats());
    setSocketError('Reservation hold expired. Please reselect your seats.');
  };

  const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);

  if (loading || !show) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 14 }}>
      {/* Show Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#141A23',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          py: 2
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="text"
              color="inherit"
              size="small"
            >
              Back
            </Button>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                {show.movie?.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {show.theatre?.name} • Screen {show.screenNumber} • {new Date(show.date).toLocaleDateString()} at {show.startTime}
              </Typography>
            </Box>
          </Box>

          <Box>
            <TimerBadge expiresAt={selectedSeats.length > 0 ? lockExpiresAt : null} onExpire={handleTimerExpire} />
          </Box>
        </Container>
      </Paper>

      {/* Main Seat Area */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {socketError && (
          <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setSocketError(null)}>
            {socketError}
          </Alert>
        )}

        <SeatLegend />

        <SeatGrid
          seatLayout={show.seatLayout}
          selectedSeats={selectedSeats}
          onToggleSeat={handleToggleSeat}
          currentUserId={user?._id}
        />
      </Container>

      {/* Floating Bottom Booking Action Bar */}
      {selectedSeats.length > 0 && (
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(20, 26, 35, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            py: 2,
            zIndex: 1000
          }}
        >
          <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                SELECTED SEATS ({selectedSeats.length})
              </Typography>
              <Typography variant="h6" fontWeight={800} color="secondary.main">
                {selectedSeats.map((s) => s.seatId).join(', ')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  SUBTOTAL
                </Typography>
                <Typography variant="h5" fontWeight={800}>
                  ₹{subtotal}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.2, fontWeight: 700 }}
                onClick={() => navigate('/checkout', { state: { showId: show._id } })}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Container>
        </Paper>
      )}
    </Box>
  );
}

import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

export default function SeatGrid({ seatLayout, selectedSeats, onToggleSeat, currentUserId }) {
  if (!seatLayout || !seatLayout.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        Loading cinema seating arrangement...
      </Box>
    );
  }

  // Group seats by tier and then by row
  const tiers = ['VIP', 'Premium', 'Standard'];
  const groupedByTier = {};

  tiers.forEach((tier) => {
    groupedByTier[tier] = {};
  });

  seatLayout.forEach((seat) => {
    const tier = seat.tier || 'Standard';
    if (!groupedByTier[tier]) groupedByTier[tier] = {};
    if (!groupedByTier[tier][seat.row]) groupedByTier[tier][seat.row] = [];
    groupedByTier[tier][seat.row].push(seat);
  });

  // Sort seats in each row by column number
  Object.keys(groupedByTier).forEach((tier) => {
    Object.keys(groupedByTier[tier]).forEach((row) => {
      groupedByTier[tier][row].sort((a, b) => a.col - b.col);
    });
  });

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
    if (isSelected) {
      return { bgcolor: '#E50914', border: '#FF3342', color: '#fff', cursor: 'pointer' };
    }
    if (seat.status === 'booked') {
      return { bgcolor: '#0B111A', border: '#1E293B', color: '#475569', cursor: 'not-allowed', opacity: 0.35 };
    }
    if (seat.status === 'locked') {
      if (currentUserId && String(seat.lockedBy) === String(currentUserId)) {
        return { bgcolor: '#E50914', border: '#FF3342', color: '#fff', cursor: 'pointer' };
      }
      return { bgcolor: '#F59E0B', border: '#FBBF24', color: '#000', cursor: 'not-allowed', opacity: 0.7 };
    }
    return { bgcolor: '#1E293B', border: '#475569', color: '#CBD5E1', cursor: 'pointer' };
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Cinema Screen Visual Curve */}
      <Box sx={{ width: '80%', maxWidth: 640, mb: 6, textAlign: 'center' }}>
        <Box
          sx={{
            height: 12,
            width: '100%',
            background: 'linear-gradient(180deg, #3B82F6 0%, transparent 100%)',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            boxShadow: '0 -4px 20px rgba(59, 130, 246, 0.4)',
            mb: 1
          }}
        />
        <Typography variant="caption" sx={{ letterSpacing: '0.2rem', color: '#94A3B8', fontWeight: 700 }}>
          CINEMA SCREEN THIS WAY
        </Typography>
      </Box>

      {/* Seating Layout per Tier */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', alignItems: 'center' }}>
        {tiers.map((tierName) => {
          const rowsInTier = Object.keys(groupedByTier[tierName] || {}).sort();
          if (rowsInTier.length === 0) return null;

          const sampleSeat = groupedByTier[tierName][rowsInTier[0]][0];
          const tierPrice = sampleSeat ? sampleSeat.price : 200;

          return (
            <Box key={tierName} sx={{ width: '100%', maxWidth: 760 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, px: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color={tierName === 'VIP' ? 'secondary.main' : 'text.primary'}>
                  {tierName.toUpperCase()} RECLINERS
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  ₹{tierPrice} per seat
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, alignItems: 'center' }}>
                {rowsInTier.map((rowLetter) => (
                  <Box key={rowLetter} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ width: 20, textAlign: 'center', fontWeight: 700, color: '#64748B' }}
                    >
                      {rowLetter}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {groupedByTier[tierName][rowLetter].map((seat, idx) => {
                        const style = getSeatColor(seat);
                        const isSelectable = seat.status === 'available' || (seat.status === 'locked' && String(seat.lockedBy) === String(currentUserId));

                        return (
                          <React.Fragment key={seat.seatId}>
                            {/* Visual Walkway Aisle gap after 5 seats */}
                            {idx === 5 && <Box sx={{ width: 20 }} />}
                            <Tooltip
                              title={`Seat ${seat.seatId} • ${seat.tier} • ₹${seat.price}`}
                              arrow
                              placement="top"
                            >
                              <Box
                                onClick={() => {
                                  if (isSelectable) onToggleSeat(seat);
                                }}
                                sx={{
                                  width: 32,
                                  height: 30,
                                  borderRadius: '6px 6px 3px 3px',
                                  bgcolor: style.bgcolor,
                                  border: `1px solid ${style.border}`,
                                  color: style.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: style.cursor,
                                  opacity: style.opacity || 1,
                                  userSelect: 'none',
                                  transition: 'all 0.15s ease',
                                  '&:hover': isSelectable ? {
                                    transform: 'scale(1.15)',
                                    borderColor: '#E50914'
                                  } : {}
                                }}
                              >
                                {seat.col}
                              </Box>
                            </Tooltip>
                          </React.Fragment>
                        );
                      })}
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{ width: 20, textAlign: 'center', fontWeight: 700, color: '#64748B' }}
                    >
                      {rowLetter}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

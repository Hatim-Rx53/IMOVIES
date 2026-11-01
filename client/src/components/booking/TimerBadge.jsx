import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

export default function TimerBadge({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTime = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0 && onExpire) {
        onExpire();
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.8,
        borderRadius: 2,
        bgcolor: isUrgent ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255, 184, 0, 0.15)',
        border: `1px solid ${isUrgent ? '#E50914' : '#FFB800'}`,
        color: isUrgent ? '#FF4D58' : '#FFB800',
        animation: isUrgent ? 'pulse 1s infinite' : 'none'
      }}
    >
      <TimerIcon sx={{ fontSize: 20 }} />
      <Typography variant="body2" fontWeight={700}>
        Seats held for: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>
    </Box>
  );
}

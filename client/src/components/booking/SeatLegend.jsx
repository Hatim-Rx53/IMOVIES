import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SeatLegend() {
  const items = [
    { label: 'Available', color: '#1E293B', border: '#475569' },
    { label: 'Selected', color: '#E50914', border: '#FF3342' },
    { label: 'Locked / Holding', color: '#F59E0B', border: '#FBBF24' },
    { label: 'Booked / Sold', color: '#0F172A', border: '#1E293B', opacity: 0.4 }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: { xs: 2, md: 4 },
        py: 2,
        px: 3,
        bgcolor: '#141A23',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        mb: 4
      }}
    >
      {items.map((item) => (
        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '4px 4px 2px 2px',
              bgcolor: item.color,
              border: `1px solid ${item.border}`,
              opacity: item.opacity || 1
            }}
          />
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

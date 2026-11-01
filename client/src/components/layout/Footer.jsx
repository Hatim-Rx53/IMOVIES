import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#080B10', color: 'text.secondary', py: 6, mt: 8, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MovieFilterIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
              <Typography variant="h6" fontWeight={800} color="text.primary">
                IMOVIES
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 360, mb: 2 }}>
              Next-generation cinema ticketing and seat reservation platform with real-time seat locking, dynamic screen visualization, and contactless e-tickets.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Built with MERN Stack • MongoDB, Express, React, Node.js & Socket.io
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" color="text.primary" fontWeight={700} sx={{ mb: 2 }}>
              CINEMA EXPLORER
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/movies" color="inherit" underline="hover" variant="body2">Trending Movies</Link>
              <Link href="/movies?genre=Sci-Fi" color="inherit" underline="hover" variant="body2">Sci-Fi Blockbusters</Link>
              <Link href="/movies?genre=Action" color="inherit" underline="hover" variant="body2">Action & Thrillers</Link>
              <Link href="/movies?genre=Drama" color="inherit" underline="hover" variant="body2">Award Winners</Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" color="text.primary" fontWeight={700} sx={{ mb: 2 }}>
              PARTNER THEATRES
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/movies" color="inherit" underline="hover" variant="body2">PVR ICON</Link>
              <Link href="/movies" color="inherit" underline="hover" variant="body2">INOX Megaplex</Link>
              <Link href="/movies" color="inherit" underline="hover" variant="body2">Cinepolis Grand</Link>
              <Link href="/movies" color="inherit" underline="hover" variant="body2">Directors Cut</Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.primary" fontWeight={700} sx={{ mb: 2 }}>
              DEMO ACCOUNTS
            </Typography>
            <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', p: 2, borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" display="block" color="text.primary">
                <strong>Admin:</strong> admin@imovies.com / Admin@123
              </Typography>
              <Typography variant="caption" display="block" color="text.primary" sx={{ mt: 0.5 }}>
                <strong>User:</strong> user@imovies.com / User@123
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.05)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} IMovies Cinema Management System. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Secure 256-bit JWT • High-Performance Concurrency Engine
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

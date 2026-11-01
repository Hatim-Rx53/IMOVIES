import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    movieCount: 0,
    theatreCount: 0,
    showCount: 0,
    bookingCount: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [moviesRes, theatresRes, showsRes, bookingsRes] = await Promise.all([
          api.get('/movies'),
          api.get('/theatres'),
          api.get('/shows'),
          api.get('/bookings/admin/all')
        ]);

        const bookings = bookingsRes.data.data || [];
        const confirmed = bookings.filter((b) => b.bookingStatus === 'confirmed');
        const revenue = confirmed.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        setStats({
          movieCount: moviesRes.data.pagination?.total || moviesRes.data.data?.length || 0,
          theatreCount: theatresRes.data.data?.length || 0,
          showCount: showsRes.data.data?.length || 0,
          bookingCount: bookings.length,
          totalRevenue: revenue
        });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      }
    };

    fetchAdminStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <CurrencyRupeeIcon sx={{ fontSize: 32, color: '#10B981' }} />, color: '#10B981' },
    { title: 'Total Bookings', value: stats.bookingCount, icon: <ConfirmationNumberIcon sx={{ fontSize: 32, color: '#3B82F6' }} />, color: '#3B82F6' },
    { title: 'Active Movies', value: stats.movieCount, icon: <MovieIcon sx={{ fontSize: 32, color: '#E50914' }} />, color: '#E50914' },
    { title: 'Theatres Active', value: stats.theatreCount, icon: <TheatersIcon sx={{ fontSize: 32, color: '#F59E0B' }} />, color: '#F59E0B' }
  ];

  const adminModules = [
    { title: 'Movie Management', desc: 'Add new releases, update synopsis, posters, cast and genres.', path: '/admin/movies', icon: <MovieIcon /> },
    { title: 'Theatre & Screens', desc: 'Manage cinema chains, auditoriums, seating layouts and tiers.', path: '/admin/theatres', icon: <TheatersIcon /> },
    { title: 'Show Scheduler', desc: 'Schedule movie screening slots, timing, dates and ticket base prices.', path: '/admin/shows', icon: <ScheduleIcon /> },
    { title: 'Bookings & Orders', desc: 'Monitor all customer transactions, ticket statuses and revenue reports.', path: '/admin/bookings', icon: <ConfirmationNumberIcon /> }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Admin Management Console
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Centralized control for cinema inventory, scheduling, and customer transactions
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((c) => (
          <Grid item key={c.title} xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#141A23', border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {c.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                    {c.value}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }}>
                  {c.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Operations Quick Access */}
      <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
        Operations & Management
      </Typography>
      <Grid container spacing={3}>
        {adminModules.map((mod) => (
          <Grid item key={mod.title} xs={12} sm={6} md={6}>
            <Card sx={{ bgcolor: '#141A23', border: '1px solid rgba(255,255,255,0.08)', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ color: 'primary.main' }}>{mod.icon}</Box>
                  <Typography variant="h6" fontWeight={700}>
                    {mod.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {mod.desc}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => navigate(mod.path)}
                >
                  Manage {mod.title.split(' ')[0]}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminBookingsPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/admin/all', {
        params: { status: statusFilter }
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} color="inherit">
            Back
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Customer Bookings & Transactions
          </Typography>
        </Box>

        <TextField
          select
          label="Status Filter"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="All">All Bookings</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="cancelled">Cancelled / Refunded</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#141A23', borderRadius: 3, p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: '#141A23', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary' } }}>
                <TableCell>Booking ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Movie</TableCell>
                <TableCell>Theatre & Screen</TableCell>
                <TableCell>Show Date & Time</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.06)' } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={800} color="secondary.main">
                      {b.bookingNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {b.user?.name || 'Customer'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {b.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {b.movie?.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{b.theatre?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Screen {b.screenNumber} • {b.theatre?.city}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(b.showDate).toLocaleDateString()}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.showTime}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {b.seats?.map((s) => s.seatId).join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={800}>
                      ₹{b.totalAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={b.bookingStatus?.toUpperCase()}
                      size="small"
                      color={b.bookingStatus === 'confirmed' ? 'success' : 'default'}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Box, Typography, Button, Divider, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrintIcon from '@mui/icons-material/Print';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import TicketModal from '../components/booking/TicketModal';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No booking details found.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          View My Bookings
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          bgcolor: '#141A23',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center'
        }}
      >
        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 80, mb: 2 }} />

        <Typography variant="h4" fontWeight={800} gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your cinema seats have been reserved. A confirmation receipt and e-ticket have been generated.
        </Typography>

        {/* Highlight Card */}
        <Box
          sx={{
            bgcolor: '#0B0E14',
            p: 3,
            borderRadius: 3,
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            maxWidth: 500,
            mx: 'auto',
            textAlign: 'left',
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              BOOKING ID
            </Typography>
            <Chip label="PAID" size="small" color="success" sx={{ fontWeight: 700 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} color="secondary.main" gutterBottom>
            {booking.bookingNumber}
          </Typography>

          <Typography variant="body1" fontWeight={700} sx={{ mt: 1 }}>
            {booking.movie?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {booking.theatre?.name} • Screen {booking.screenNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {new Date(booking.showDate).toLocaleDateString()} at {booking.showTime}
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">SEATS</Typography>
              <Typography variant="body2" fontWeight={800}>{booking.seats?.map((s) => s.seatId).join(', ')}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">AMOUNT PAID</Typography>
              <Typography variant="body2" fontWeight={800}>₹{booking.totalAmount}</Typography>
            </Box>
          </Box>

          {booking.qrCodeData && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Box
                component="img"
                src={booking.qrCodeData}
                alt="Ticket QR Code"
                sx={{ width: 120, height: 120, bgcolor: '#fff', p: 1, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Scan at cinema entry gate
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => setTicketModalOpen(true)}
            sx={{ px: 3, py: 1, fontWeight: 700 }}
          >
            View & Print Full Ticket
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ px: 3, py: 1 }}
          >
            Go to My Bookings
          </Button>
          <Button
            variant="text"
            startIcon={<MovieFilterIcon />}
            onClick={() => navigate('/movies')}
          >
            Explore More Movies
          </Button>
        </Box>
      </Paper>

      <TicketModal
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        booking={booking}
      />
    </Container>
  );
}

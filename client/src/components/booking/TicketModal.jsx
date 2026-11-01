import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
  Chip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

export default function TicketModal({ open, onClose, booking }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const movieTitle = booking.movie?.title || 'Cinema Movie';
  const theatreName = booking.theatre?.name || 'IMovies Theatre';
  const showDate = new Date(booking.showDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#141A23',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Ticket Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MovieFilterIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={800} color="text.primary">
              IMOVIES E-TICKET
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label="CONFIRMED"
            color="success"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Box>

        {/* Ticket Container */}
        <Box
          sx={{
            bgcolor: '#0B0E14',
            p: 3,
            borderRadius: 2,
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            position: 'relative'
          }}
        >
          <Typography variant="h5" fontWeight={800} color="primary.main" gutterBottom>
            {movieTitle}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {theatreName} • Screen {booking.screenNumber || 1}
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">SHOW DATE</Typography>
              <Typography variant="body2" fontWeight={700}>{showDate}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">SHOWTIME</Typography>
              <Typography variant="body2" fontWeight={700}>{booking.showTime}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">SEATS</Typography>
              <Typography variant="body2" fontWeight={800} color="secondary.main">
                {booking.seats?.map((s) => s.seatId).join(', ')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">TOTAL PAID</Typography>
              <Typography variant="body2" fontWeight={800}>₹{booking.totalAmount}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* QR Code and Booking Code */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">BOOKING ID</Typography>
              <Typography variant="subtitle2" fontWeight={800} sx={{ letterSpacing: 1 }}>
                {booking.bookingNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Show this barcode / QR at cinema entrance
              </Typography>
            </Box>
            {booking.qrCodeData && (
              <Box
                component="img"
                src={booking.qrCodeData}
                alt="Ticket QR Code"
                sx={{ width: 90, height: 90, borderRadius: 1.5, bgcolor: '#fff', p: 0.5 }}
              />
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3, pt: 0, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Close
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
        >
          Print Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
}

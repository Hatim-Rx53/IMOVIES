import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../store/slices/bookingSlice';
import TicketModal from '../components/booking/TicketModal';

export default function UserDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading } = useSelector((state) => state.bookings);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleOpenCancel = (booking) => {
    setTargetBooking(booking);
    setCancelReason('Change of schedule');
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetBooking) return;
    const res = await dispatch(cancelBooking({ id: targetBooking._id, reason: cancelReason }));
    if (cancelBooking.fulfilled.match(res)) {
      setCancelFeedback(`Booking ${targetBooking.bookingNumber} successfully cancelled. ₹${targetBooking.totalAmount} will be refunded.`);
      setCancelDialogOpen(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* User Header Profile */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#141A23', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <AccountCircleIcon sx={{ fontSize: 56, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email} • {user?.phone || 'No phone set'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {cancelFeedback && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setCancelFeedback(null)}>
          {cancelFeedback}
        </Alert>
      )}

      {/* Bookings Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Booking History ({bookings.length})
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#141A23', borderRadius: 3, p: 4 }}>
          <ConfirmationNumberIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="text.secondary">
            You have no cinema bookings yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'confirmed';
            return (
              <Grid item key={b._id} xs={12} md={6}>
                <Card sx={{ bgcolor: '#141A23', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {b.bookingNumber}
                        </Typography>
                        <Typography variant="h6" fontWeight={800} color="text.primary">
                          {b.movie?.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={b.bookingStatus?.toUpperCase()}
                        color={isConfirmed ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {b.theatre?.name} • Screen {b.screenNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {new Date(b.showDate).toLocaleDateString()} at {b.showTime}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          SEATS
                        </Typography>
                        <Typography variant="body2" fontWeight={800} color="secondary.main">
                          {b.seats?.map((s) => s.seatId).join(', ')}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          TOTAL PAID
                        </Typography>
                        <Typography variant="body1" fontWeight={800}>
                          ₹{b.totalAmount}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="inherit"
                        startIcon={<PrintIcon />}
                        onClick={() => setSelectedTicket(b)}
                        fullWidth
                      >
                        View Ticket
                      </Button>
                      {isConfirmed && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleOpenCancel(b)}
                          fullWidth
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Ticket Modal */}
      <TicketModal
        open={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        booking={selectedTicket}
      />

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#141A23', borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Ticket Cancellation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to cancel your booking for <strong>{targetBooking?.movie?.title}</strong>? Your refund of ₹{targetBooking?.totalAmount} will be processed immediately.
          </Typography>
          <TextField
            label="Reason for Cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setCancelDialogOpen(false)} color="inherit">
            Keep Booking
          </Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking } from '../store/slices/bookingSlice';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { selectedSeats, loading, error } = useSelector((state) => state.bookings);
  const { currentShow: show } = useSelector((state) => state.shows);
  const { user } = useSelector((state) => state.auth);

  const showId = location.state?.showId || show?._id;

  const [paymentTab, setPaymentTab] = useState(0);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Payment form states
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'Hatim Rampurawala',
    expiry: '12/28',
    cvv: '123'
  });
  const [upiId, setUpiId] = useState(`${user?.email?.split('@')[0] || 'hatim'}@okhdfcbank`);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!selectedSeats || selectedSeats.length === 0 || !show) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No seats selected for checkout.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/movies')} sx={{ mt: 2 }}>
          Browse Movies
        </Button>
      </Container>
    );
  }

  const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const convenienceFee = Math.round(subtotal * 0.05) + 30;
  const totalAmount = subtotal + convenienceFee;

  const handlePayment = async () => {
    setErrorMessage(null);

    const paymentMethods = ['card', 'upi', 'netbanking'];
    const payload = {
      showId,
      seatIds: selectedSeats.map((s) => s.seatId),
      paymentMethod: paymentMethods[paymentTab],
      simulateFailure,
      cardDetails: paymentTab === 0 ? cardData : undefined,
      upiId: paymentTab === 1 ? upiId : undefined,
      bankName: paymentTab === 2 ? selectedBank : undefined
    };

    const result = await dispatch(createBooking(payload));
    if (createBooking.fulfilled.match(result)) {
      navigate('/booking-success', { state: { booking: result.payload } });
    } else {
      setErrorMessage(result.payload || 'Payment failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Checkout & Payment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Secure 256-bit encrypted checkout with instant e-ticket generation
      </Typography>

      {(errorMessage || error) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
          {errorMessage || error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Payment Methods Column */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, bgcolor: '#141A23', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={paymentTab}
                onChange={(e, v) => setPaymentTab(v)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab icon={<CreditCardIcon />} label="Credit / Debit Card" sx={{ fontWeight: 600 }} />
                <Tab icon={<QrCode2Icon />} label="UPI" sx={{ fontWeight: 600 }} />
                <Tab icon={<AccountBalanceIcon />} label="Net Banking" sx={{ fontWeight: 600 }} />
              </Tabs>
            </Box>

            {/* Credit / Debit Card Form */}
            {paymentTab === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Card Number"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Cardholder Name"
                  value={cardData.cardHolder}
                  onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                  fullWidth
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Valid Thru (MM/YY)"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="CVV"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    fullWidth
                    size="small"
                    type="password"
                  />
                </Box>
              </Box>
            )}

            {/* UPI Form */}
            {paymentTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Enter UPI ID (VPA)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  fullWidth
                  size="small"
                  helperText="e.g. mobileNumber@upi or username@bank"
                />
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {['@okhdfcbank', '@okicici', '@paytm', '@ybl'].map((suffix) => (
                    <Button
                      key={suffix}
                      size="small"
                      variant="outlined"
                      onClick={() => setUpiId(`${user?.email?.split('@')[0] || 'user'}${suffix}`)}
                      sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      {suffix}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Net Banking Form */}
            {paymentTab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select
                  label="Select Bank"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  fullWidth
                  size="small"
                >
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'].map((b) => (
                    <MenuItem key={b} value={b}>{b}</MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" color="text.secondary">
                  You will be redirected to the bank's secure authorization portal.
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

            {/* Test Simulation Controls */}
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    color="error"
                  />
                }
                label={<Typography variant="body2" fontWeight={600}>Simulate Payment Gateway Failure (Testing)</Typography>}
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Toggle to test how the application handles declined cards and payment rejections.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary Column */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, bgcolor: '#141A23', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box
                component="img"
                src={show.movie?.posterUrl}
                alt={show.movie?.title}
                sx={{ width: 60, height: 85, borderRadius: 1.5, objectFit: 'cover' }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {show.movie?.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {show.theatre?.name} • Screen {show.screenNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {new Date(show.date).toLocaleDateString()} at {show.startTime}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Seats ({selectedSeats.length})
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {selectedSeats.map((s) => s.seatId).join(', ')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tickets Subtotal
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                ₹{subtotal}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Convenience Fee & GST
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                ₹{convenienceFee}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>
                Total Payable
              </Typography>
              <Typography variant="h5" fontWeight={800} color="secondary.main">
                ₹{totalAmount}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
              disabled={loading}
              onClick={handlePayment}
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 800 }}
            >
              {loading ? 'Processing Payment...' : `Pay ₹${totalAmount} & Confirm`}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

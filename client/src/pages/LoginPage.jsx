import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    dispatch(clearError());
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          bgcolor: '#141A23',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MovieFilterIcon sx={{ color: 'primary.main', fontSize: 44, mb: 1 }} />
          <Typography variant="h5" fontWeight={800}>
            Sign In to IMovies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access real-time seat locking & booking history
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 1, py: 1.2, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <Typography variant="caption" color="text.secondary">
            QUICK DEMO ACCESS
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            fullWidth
            onClick={() => handleQuickFill('admin@imovies.com', 'Admin@123')}
          >
            Admin Demo
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            fullWidth
            onClick={() => handleQuickFill('user@imovies.com', 'User@123')}
          >
            User Demo
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary.main" fontWeight={700}>
              Create one
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

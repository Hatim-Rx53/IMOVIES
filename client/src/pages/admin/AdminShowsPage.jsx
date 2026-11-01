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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminShowsPage() {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    movie: '',
    theatre: '',
    screenNumber: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '14:15',
    endTime: '16:45',
    basePrice: 250
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies?limit=100'),
        api.get('/theatres')
      ]);
      setShows(showsRes.data.data);
      setMovies(moviesRes.data.data);
      setTheatres(theatresRes.data.data);

      if (moviesRes.data.data.length > 0 && theatresRes.data.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          movie: moviesRes.data.data[0]._id,
          theatre: theatresRes.data.data[0]._id
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this showtime? All associated seat maps will be removed.')) {
      try {
        await api.delete(`/shows/${id}`);
        setFeedback('Show deleted successfully.');
        loadData();
      } catch (err) {
        setFeedback('Failed to delete show.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shows', formData);
      setFeedback('Show created and tiered seats auto-generated successfully.');
      setModalOpen(false);
      loadData();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Error creating show.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} color="inherit">
            Back
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Show Scheduling
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          Schedule New Show
        </Button>
      </Box>

      {feedback && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: '#141A23', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary' } }}>
                <TableCell>Movie</TableCell>
                <TableCell>Theatre & Screen</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Showtime</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>Available Seats</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shows.map((s) => (
                <TableRow key={s._id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.06)' } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {s.movie?.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{s.theatre?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Screen {s.screenNumber} • {s.theatre?.city}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {s.startTime}
                    </Typography>
                  </TableCell>
                  <TableCell>₹{s.basePrice}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" fontWeight={700}>
                      {s.availableSeats} / {s.totalSeats}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDelete(s._id)} sx={{ color: 'error.main' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Schedule Show Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#141A23', borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Schedule Movie Showtime</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Select Movie"
              value={formData.movie}
              onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
              required
              fullWidth
              size="small"
            >
              {movies.map((m) => (
                <MenuItem key={m._id} value={m._id}>{m.title}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select Theatre"
              value={formData.theatre}
              onChange={(e) => setFormData({ ...formData, theatre: e.target.value })}
              required
              fullWidth
              size="small"
            >
              {theatres.map((t) => (
                <MenuItem key={t._id} value={t._id}>{t.name} ({t.city})</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <TextField
                label="Screen Number"
                type="number"
                value={formData.screenNumber}
                onChange={(e) => setFormData({ ...formData, screenNumber: Number(e.target.value) })}
                required
                size="small"
              />
              <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Start Time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="14:30"
                required
                size="small"
              />
              <TextField
                label="End Time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="17:00"
                required
                size="small"
              />
            </Box>

            <TextField
              label="Base Ticket Price (₹)"
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              required
              fullWidth
              size="small"
              helperText="VIP and Premium seats will auto-calculate based on screen multiplier"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create & Generate Seats
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}

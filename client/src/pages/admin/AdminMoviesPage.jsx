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
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminMoviesPage() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const initialFormState = {
    title: '',
    description: '',
    genres: 'Action, Sci-Fi',
    languages: 'English, Hindi',
    duration: 140,
    rating: 8.5,
    posterUrl: '',
    trailerUrl: '',
    director: '',
    cast: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movies?limit=100');
      setMovies(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      genres: movie.genres?.join(', ') || '',
      languages: movie.languages?.join(', ') || '',
      duration: movie.duration,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl || '',
      director: movie.director || '',
      cast: movie.cast?.join(', ') || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await api.delete(`/movies/${id}`);
        setFeedback('Movie removed successfully.');
        loadMovies();
      } catch (err) {
        setFeedback('Failed to remove movie.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await api.put(`/movies/${editingMovie._id}`, formData);
        setFeedback('Movie updated successfully.');
      } else {
        await api.post('/movies', formData);
        setFeedback('New movie created successfully.');
      }
      setModalOpen(false);
      loadMovies();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Error saving movie.');
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
            Movie Management
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add New Movie
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
                <TableCell>Genres</TableCell>
                <TableCell>Languages</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((m) => (
                <TableRow key={m._id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.06)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={m.posterUrl}
                        alt={m.title}
                        sx={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight={700}>
                          {m.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {m.director ? `Dir: ${m.director}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {m.genres?.slice(0, 2).map((g) => (
                        <Chip key={g} label={g} size="small" sx={{ fontSize: '0.7rem' }} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{m.languages?.join(', ')}</TableCell>
                  <TableCell>{m.duration} mins</TableCell>
                  <TableCell>{m.rating} / 10</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(m)} sx={{ color: 'text.secondary' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(m._id)} sx={{ color: 'error.main' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Movie Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#141A23', borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingMovie ? 'Edit Movie' : 'Add New Movie'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Movie Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Description / Synopsis"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={3}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <TextField
                label="Genres (comma-separated)"
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                required
                size="small"
              />
              <TextField
                label="Languages (comma-separated)"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                required
                size="small"
              />
              <TextField
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                required
                size="small"
              />
              <TextField
                label="Rating (out of 10)"
                type="number"
                inputProps={{ step: '0.1', min: '1', max: '10' }}
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                required
                size="small"
              />
            </Box>
            <TextField
              label="Poster Image URL"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              placeholder="https://..."
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Trailer YouTube URL"
              value={formData.trailerUrl}
              onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <TextField
                label="Director"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                size="small"
              />
              <TextField
                label="Cast (comma-separated)"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                size="small"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingMovie ? 'Save Changes' : 'Create Movie'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}

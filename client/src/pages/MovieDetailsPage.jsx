import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, Chip, CircularProgress, Alert } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovieById } from '../store/slices/movieSlice';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie: movie, loading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Movie not found'}</Alert>
      </Container>
    );
  }

  const releaseFormatted = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Box sx={{ pb: 8 }}>
      {/* Banner Backdrop */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 260, md: 420 },
          width: '100%',
          backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(11,14,20,0.4) 0%, #0B0E14 100%)'
          }
        }}
      />

      {/* Main Details */}
      <Container maxWidth="xl" sx={{ position: 'relative', mt: { xs: -12, md: -20 }, zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Poster Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              component="img"
              src={movie.posterUrl}
              alt={movie.title}
              sx={{
                width: '100%',
                borderRadius: 3,
                boxShadow: '0 16px 32px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          </Grid>

          {/* Details Column */}
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 184, 0, 0.2)',
                  border: '1px solid #FFB800',
                  color: '#FFB800',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 700
                }}
              >
                <StarIcon sx={{ fontSize: 18 }} />
                {movie.rating ? movie.rating.toFixed(1) : '8.5'} / 10
              </Box>
              <Typography variant="body2" color="text.secondary">
                Audience Score
              </Typography>
            </Box>

            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
              {movie.title}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <AccessTimeIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{movie.duration} mins</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <CalendarMonthIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{releaseFormatted}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Languages: <strong>{movie.languages?.join(', ')}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {movie.genres?.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600 }}
                />
              ))}
            </Box>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Synopsis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, maxWidth: 800 }}>
              {movie.description}
            </Typography>

            {movie.director && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary">DIRECTOR</Typography>
                <Typography variant="body2" fontWeight={700}>{movie.director}</Typography>
              </Box>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" color="text.secondary">STARRING</Typography>
                <Typography variant="body2" fontWeight={700}>{movie.cast.join(', ')}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ConfirmationNumberIcon />}
                onClick={() => navigate(`/movies/${movie._id}/shows`)}
                sx={{ px: 4, py: 1.2, fontWeight: 700 }}
              >
                View Showtimes & Book
              </Button>
              {movie.trailerUrl && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => window.open(movie.trailerUrl, '_blank')}
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Trailer
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

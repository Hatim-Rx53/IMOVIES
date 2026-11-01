import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovieById } from '../store/slices/movieSlice';
import { fetchShows } from '../store/slices/showSlice';

export default function ShowSelectionPage() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedMovie: movie } = useSelector((state) => state.movies);
  const { shows, loading, error } = useSelector((state) => state.shows);
  const { filters } = useSelector((state) => state.movies);

  // Generate next 3 dates
  const dates = [0, 1, 2].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      dateString: d.toISOString().split('T')[0],
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const [selectedDate, setSelectedDate] = useState(dates[0].dateString);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieById(movieId));
    }
  }, [dispatch, movieId]);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchShows({ movie: movieId, date: selectedDate, city: filters.city }));
    }
  }, [dispatch, movieId, selectedDate, filters.city]);

  // Group shows by Theatre
  const showsByTheatre = {};
  shows.forEach((show) => {
    const theatreId = show.theatre?._id;
    if (!theatreId) return;
    if (!showsByTheatre[theatreId]) {
      showsByTheatre[theatreId] = {
        theatre: show.theatre,
        screenShows: []
      };
    }
    showsByTheatre[theatreId].screenShows.push(show);
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Info */}
      {movie && (
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box
            component="img"
            src={movie.posterUrl}
            alt={movie.title}
            sx={{ width: 70, height: 100, objectFit: 'cover', borderRadius: 2 }}
          />
          <Box>
            <Typography variant="h4" fontWeight={800}>
              {movie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {movie.genres?.join(', ')} • {movie.duration} mins • {movie.languages?.join(', ')}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Date Selector Tabs */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 4, overflowX: 'auto', pb: 1 }}>
        {dates.map((item) => (
          <Button
            key={item.dateString}
            variant={selectedDate === item.dateString ? 'contained' : 'outlined'}
            color={selectedDate === item.dateString ? 'primary' : 'inherit'}
            onClick={() => setSelectedDate(item.dateString)}
            sx={{
              flexDirection: 'column',
              py: 1.2,
              px: 3,
              borderRadius: 2.5,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              minWidth: 100
            }}
          >
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
              {item.dayName}
            </Typography>
            <Typography variant="body1" fontWeight={800}>
              {item.formattedDate}
            </Typography>
          </Button>
        ))}
      </Box>

      {/* Theatres & Shows */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : Object.keys(showsByTheatre).length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#141A23', borderRadius: 3, p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No shows scheduled for the selected date or city.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please select another date or change the city in the top navigation bar.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.values(showsByTheatre).map(({ theatre, screenShows }) => (
            <Card key={theatre._id} sx={{ bgcolor: '#141A23', p: 1 }}>
              <CardContent>
                {/* Theatre Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {theatre.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mt: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {theatre.address}, {theatre.city}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
                    {theatre.facilities?.slice(0, 3).map((f) => (
                      <Chip key={f} label={f} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />

                {/* Showtimes Grid */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  {screenShows.map((show) => (
                    <Box
                      key={show._id}
                      onClick={() => navigate(`/shows/${show._id}/seats`)}
                      sx={{
                        p: 1.5,
                        px: 2.5,
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'rgba(229, 9, 20, 0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body1" fontWeight={700}>
                          {show.startTime}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Screen {show.screenNumber} • ₹{show.basePrice}
                      </Typography>
                      <Typography variant="caption" color="success.main" fontWeight={600} display="block">
                        {show.availableSeats} seats left
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

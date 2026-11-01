import React, { useEffect } from 'react';
import { Container, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies } from '../store/slices/movieSlice';
import MovieHeroCarousel from '../components/movies/MovieHeroCarousel';
import MovieCard from '../components/movies/MovieCard';
import MovieFilterBar from '../components/movies/MovieFilterBar';

export default function HomePage() {
  const dispatch = useDispatch();
  const { movies, loading, error, filters } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies(filters));
  }, [dispatch, filters.search, filters.genre, filters.language, filters.city]);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Blockbuster Carousel */}
      <MovieHeroCarousel movies={movies} />

      <Container maxWidth="xl" sx={{ mt: 5 }}>
        {/* Filters */}
        <MovieFilterBar />

        {/* Section Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Now Showing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movies.length} movies available
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : movies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#141A23', borderRadius: 3, p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No movies found matching your filters.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

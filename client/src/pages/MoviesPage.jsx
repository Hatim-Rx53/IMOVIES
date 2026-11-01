import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Tabs, Tab, CircularProgress, Card, CardContent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchMovies } from '../store/slices/movieSlice';
import api from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import MovieFilterBar from '../components/movies/MovieFilterBar';

export default function MoviesPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { movies, loading, filters } = useSelector((state) => state.movies);

  const [activeTab, setActiveTab] = useState(searchParams.get('view') === 'theatres' ? 1 : 0);
  const [theatres, setTheatres] = useState([]);
  const [theatresLoading, setTheatresLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies(filters));
  }, [dispatch, filters.search, filters.genre, filters.language, filters.city]);

  useEffect(() => {
    if (activeTab === 1) {
      setTheatresLoading(true);
      api.get('/theatres', { params: { city: filters.city } })
        .then((res) => setTheatres(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setTheatresLoading(false));
    }
  }, [activeTab, filters.city]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* View Switcher Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary">
          <Tab label="All Movies" sx={{ fontWeight: 700, fontSize: '1rem' }} />
          <Tab label="Explore Theatres" sx={{ fontWeight: 700, fontSize: '1rem' }} />
        </Tabs>
      </Box>

      {/* Filter Bar */}
      <MovieFilterBar />

      {activeTab === 0 ? (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        /* Theatres View */
        theatresLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {theatres.map((theatre) => (
              <Grid item key={theatre._id} xs={12} md={6}>
                <Card sx={{ p: 1, bgcolor: '#141A23' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {theatre.name}
                      </Typography>
                      <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.08)', px: 1, py: 0.5, borderRadius: 1 }}>
                        {theatre.city}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {theatre.address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Facilities: {theatre.facilities?.join(' • ')}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                      {theatre.screens?.length} Auditoriums available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Container>
  );
}

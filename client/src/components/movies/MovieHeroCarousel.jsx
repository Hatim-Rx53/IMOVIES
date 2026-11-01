import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

export default function MovieHeroCarousel({ movies }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroMovies = movies?.slice(0, 4) || [];

  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (!heroMovies.length) return null;

  const movie = heroMovies[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 440, md: 540 },
        width: '100%',
        overflow: 'hidden',
        bgcolor: '#080B10'
      }}
    >
      {/* Background Banner with Cinema Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.8s ease-in-out',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #0B0E14 0%, rgba(11, 14, 20, 0.85) 45%, rgba(11, 14, 20, 0.3) 100%), linear-gradient(0deg, #0B0E14 0%, transparent 60%)'
          }
        }}
      />

      {/* Content Overlay */}
      <Container maxWidth="xl" sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ maxWidth: 650, zIndex: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255, 184, 0, 0.2)',
                border: '1px solid #FFB800',
                color: '#FFB800',
                px: 1,
                py: 0.2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              <StarIcon sx={{ fontSize: 16 }} />
              {movie.rating ? movie.rating.toFixed(1) : '8.8'}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {movie.duration} mins • {movie.languages?.join(', ')}
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3.2rem' },
              lineHeight: 1.1,
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            {movie.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {movie.genres?.map((g) => (
              <Chip
                key={g}
                label={g}
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fff', backdropFilter: 'blur(4px)' }}
              />
            ))}
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 3,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.95rem'
            }}
          >
            {movie.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ConfirmationNumberIcon />}
              onClick={() => navigate(`/movies/${movie._id}/shows`)}
              sx={{ px: 3, py: 1.2, fontSize: '1rem', fontWeight: 700 }}
            >
              Book Tickets
            </Button>
            {movie.trailerUrl && (
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  bgcolor: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => window.open(movie.trailerUrl, '_blank')}
              >
                Watch Trailer
              </Button>
            )}
          </Box>

          {/* Carousel Indicator Dots */}
          <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
            {heroMovies.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: idx === currentIndex ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: idx === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

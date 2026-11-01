import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Button, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#141A23',
        cursor: 'pointer'
      }}
      onClick={() => navigate(`/movies/${movie._id}`)}
    >
      {/* Poster */}
      <Box sx={{ position: 'relative', pt: '140%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={movie.posterUrl}
          alt={movie.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        {/* Rating Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            px: 1,
            py: 0.5,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            border: '1px solid rgba(255, 184, 0, 0.4)'
          }}
        >
          <StarIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
          <Typography variant="caption" fontWeight={700} color="text.primary">
            {movie.rating ? movie.rating.toFixed(1) : '8.5'}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={700} noWrap title={movie.title} sx={{ mb: 0.5 }}>
          {movie.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}>
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">{movie.duration} mins</Typography>
          <Typography variant="caption">•</Typography>
          <Typography variant="caption">{movie.languages?.slice(0, 2).join(', ')}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {movie.genres?.slice(0, 2).map((genre) => (
            <Chip
              key={genre}
              label={genre}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                color: 'text.secondary',
                fontSize: '0.7rem',
                height: 22
              }}
            />
          ))}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            startIcon={<ConfirmationNumberIcon />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie._id}/shows`);
            }}
          >
            Book Tickets
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

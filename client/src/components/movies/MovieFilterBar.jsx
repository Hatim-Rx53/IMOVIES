import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters, fetchMovies } from '../../store/slices/movieSlice';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Thriller', 'Animation', 'Biography', 'Crime'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Spanish'];

export default function MovieFilterBar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.movies);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleGenreChange = (e) => {
    dispatch(setFilters({ genre: e.target.value }));
  };

  const handleLanguageChange = (e) => {
    dispatch(setFilters({ language: e.target.value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(fetchMovies());
  };

  return (
    <Box
      sx={{
        bgcolor: '#141A23',
        p: 2,
        borderRadius: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        mb: 4
      }}
    >
      {/* Search Input */}
      <TextField
        placeholder="Search movies, cast, directors..."
        size="small"
        value={filters.search}
        onChange={handleSearchChange}
        sx={{
          flexGrow: 1,
          minWidth: 240,
          bgcolor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          )
        }}
      />

      {/* Genre Filter */}
      <TextField
        select
        label="Genre"
        size="small"
        value={filters.genre}
        onChange={handleGenreChange}
        sx={{ minWidth: 150 }}
      >
        {GENRES.map((g) => (
          <MenuItem key={g} value={g}>
            {g}
          </MenuItem>
        ))}
      </TextField>

      {/* Language Filter */}
      <TextField
        select
        label="Language"
        size="small"
        value={filters.language}
        onChange={handleLanguageChange}
        sx={{ minWidth: 140 }}
      >
        {LANGUAGES.map((l) => (
          <MenuItem key={l} value={l}>
            {l}
          </MenuItem>
        ))}
      </TextField>

      {/* Reset Filter Button */}
      <Button
        variant="outlined"
        color="inherit"
        size="medium"
        startIcon={<RestartAltIcon />}
        onClick={handleReset}
        sx={{ color: 'text.secondary', borderColor: 'rgba(255, 255, 255, 0.15)' }}
      >
        Reset
      </Button>
    </Box>
  );
}

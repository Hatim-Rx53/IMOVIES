import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setFilters } from '../../store/slices/movieSlice';
import { fetchNotifications, markNotificationsAsRead } from '../../store/slices/notificationSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filters } = useSelector((state) => state.movies);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  const handleCityChange = (e) => {
    dispatch(setFilters({ city: e.target.value }));
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
    if (unreadCount > 0) {
      dispatch(markNotificationsAsRead());
    }
  };
  const handleCloseNotif = () => setAnchorElNotif(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'rgba(11, 14, 20, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70 }}>
          {/* Brand Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4
            }}
          >
            <MovieFilterIcon sx={{ color: 'primary.main', fontSize: 34, mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 900,
                letterSpacing: '.1rem',
                background: 'linear-gradient(45deg, #E50914, #FFAA00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              IMOVIES
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={RouterLink} to="/movies" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Movies
            </Button>
            <Button component={RouterLink} to="/movies?view=theatres" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Theatres
            </Button>

            {/* City Selection */}
            <FormControl size="small" sx={{ minWidth: 120, ml: 2 }}>
              <Select
                value={filters.city || 'All'}
                onChange={handleCityChange}
                displayEmpty
                sx={{
                  color: 'text.primary',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <MenuItem value="All">All Cities</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Thane">Thane</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {/* Admin Portal Shortcut */}
                {user.role === 'admin' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<AdminPanelSettingsIcon />}
                    component={RouterLink}
                    to="/admin"
                    sx={{ mr: 1, fontWeight: 700 }}
                  >
                    Admin Console
                  </Button>
                )}

                {/* Notifications */}
                <IconButton onClick={handleOpenNotif} sx={{ color: 'text.primary' }}>
                  <Badge badgeContent={unreadCount} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Popover
                  open={Boolean(anchorElNotif)}
                  anchorEl={anchorElNotif}
                  onClose={handleCloseNotif}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { width: 340, maxHeight: 420, p: 1, bgcolor: '#141A23' } }}
                >
                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Notifications
                    </Typography>
                    {notifications.length > 0 && (
                      <Chip label={`${notifications.length} recent`} size="small" color="primary" variant="outlined" />
                    )}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                      <ListItem sx={{ py: 3, textAlign: 'center' }}>
                        <ListItemText secondary="No notifications yet" />
                      </ListItem>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <ListItem key={notif._id} alignItems="flex-start" sx={{ px: 1.5, py: 1 }}>
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={600}>{notif.title}</Typography>}
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {notif.message}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Popover>

                {/* User Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleOpenUserMenu}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role === 'admin' ? 'Administrator' : 'Moviegoer'}
                    </Typography>
                  </Box>
                </Box>

                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{ sx: { bgcolor: '#141A23', minWidth: 200 } }}
                >
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/dashboard'); }}>
                    <ConfirmationNumberIcon sx={{ mr: 1.5, fontSize: 20 }} /> My Bookings
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin'); }}>
                      <AdminPanelSettingsIcon sx={{ mr: 1.5, fontSize: 20, color: 'secondary.main' }} /> Admin Panel
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.light' }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button component={RouterLink} to="/login" variant="text" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Sign In
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="primary">
                  Get Started
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

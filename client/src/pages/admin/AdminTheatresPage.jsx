import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminTheatresPage() {
  const navigate = useNavigate();

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    city: 'Mumbai',
    address: '',
    facilities: 'Dolby Atmos, 4K Projection, Gourmet Snacks'
  });

  const loadTheatres = async () => {
    setLoading(true);
    try {
      const res = await api.get('/theatres');
      setTheatres(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedFacilities = formData.facilities.split(',').map((s) => s.trim());
      await api.post('/theatres', {
        ...formData,
        facilities: parsedFacilities
      });
      setFeedback('New theatre registered successfully.');
      setModalOpen(false);
      loadTheatres();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Error creating theatre.');
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
            Theatre & Screen Management
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          Register Theatre
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
        <Grid container spacing={3}>
          {theatres.map((t) => (
            <Grid item key={t._id} xs={12} md={6}>
              <Card sx={{ bgcolor: '#141A23', border: '1px solid rgba(255,255,255,0.08)', p: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight={800}>
                      {t.name}
                    </Typography>
                    <Chip label={t.city} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{t.address}</Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                    FACILITIES: {t.facilities?.join(' • ')}
                  </Typography>

                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      CONFIGURED SCREENS ({t.screens?.length || 0})
                    </Typography>
                    {t.screens?.map((scr) => (
                      <Box key={scr.screenNumber} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">{scr.name}</Typography>
                        <Typography variant="caption" color="primary.main" fontWeight={600}>
                          {scr.totalSeats || 60} Total Seats (VIP / Premium / Std)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Register Theatre Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#141A23', borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Register Partner Theatre</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Theatre Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              size="small"
              placeholder="e.g. Cinepolis - Nexus Mall"
            />
            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Street Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Facilities (comma-separated)"
              value={formData.facilities}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              fullWidth
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Register Theatre
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}

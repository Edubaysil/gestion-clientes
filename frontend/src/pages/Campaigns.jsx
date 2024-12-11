// src/pages/Campaigns.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [location, setLocation] = useState('');
  const [costeOptometra, setCosteOptometra] = useState('');
  const [viaticos, setViaticos] = useState('');
  const [origen, setOrigen] = useState('por convenio');
  const [editingCampaign, setEditingCampaign] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/campaigns', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCampaigns(response.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchCampaigns();
  }, [navigate]);

  const handleCreateOrUpdateCampaign = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const campaignData = {
        name,
        startDate,
        endDate,
        status,
        location,
        coste_optometra: costeOptometra,
        viaticos,
        origen,
      };

      if (editingCampaign) {
        const response = await axios.put(
          `/api/campaigns/${editingCampaign._id}`,
          campaignData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCampaigns(campaigns.map(c => c._id === editingCampaign._id ? response.data : c));
        setEditingCampaign(null);
      } else {
        const response = await axios.post(
          '/api/campaigns',
          campaignData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCampaigns([...campaigns, response.data]);
      }
      setName('');
      setStartDate('');
      setEndDate('');
      setStatus('active');
      setLocation('');
      setCosteOptometra('');
      setViaticos('');
      setOrigen('por convenio');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCampaign = (campaign) => {
    setName(campaign.name);
    setStartDate(campaign.startDate);
    setEndDate(campaign.endDate);
    setStatus(campaign.status);
    setLocation(campaign.location);
    setCosteOptometra(campaign.coste_optometra);
    setViaticos(campaign.viaticos);
    setOrigen(campaign.origen);
    setEditingCampaign(campaign);
  };

  const handleDeleteCampaign = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
            <Typography variant="h4" gutterBottom style={{ color: 'var(--color-primary)' }}>Campañas</Typography>
            <form onSubmit={handleCreateOrUpdateCampaign}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nombre"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Fecha Inicio"
                  type="datetime-local"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true, style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Fecha Fin"
                  type="datetime-local"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true, style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Estado</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="closed">Cerrado</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Ubicación"
                  type="text"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Coste Optometra"
                  type="number"
                  fullWidth
                  value={costeOptometra}
                  onChange={(e) => setCosteOptometra(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Viáticos"
                  type="number"
                  fullWidth
                  value={viaticos}
                  onChange={(e) => setViaticos(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Origen</InputLabel>
                <Select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="por convenio">Por Convenio</MenuItem>
                  <MenuItem value="por gestión">Por Gestión</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" fullWidth style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                {editingCampaign ? 'Actualizar' : 'Crear'} Campaña
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom style={{ color: 'var(--color-primary)' }}>Lista de Campañas</Typography>
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
              <ul>
                {campaigns.map((campaign) => (
                  <li key={campaign._id} style={{ marginBottom: '1rem' }}>
                    <Typography variant="body1" style={{ color: 'var(--color-text)' }}>{campaign.name}</Typography>
                    <Button onClick={() => handleEditCampaign(campaign)} style={{ marginLeft: '1rem', backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteCampaign(campaign._id)} style={{ marginLeft: '1rem', backgroundColor: 'var(--color-accent-dark)', color: 'white' }}>
                      Eliminar
                    </Button>
                  </li>
                ))}
              </ul>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Campaigns;
// src/pages/Reporte.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';

const Reporte = () => {
  const [campaignId, setCampaignId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [report, setReport] = useState(null);
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
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, [navigate]);

  const fetchCampaignData = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`/api/reportes/campaign/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    }
  };

  const generateReport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/reportes/generate', { campaignId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Reporte generado y guardado en la base de datos.');
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleSearchCampaign = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`/api/campaigns?name=${campaignName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.length > 0) {
        setCampaignId(response.data[0]._id);
      } else {
        alert('No se encontró ninguna campaña con ese nombre');
      }
    } catch (error) {
      console.error('Error searching campaign:', error);
    }
  };

  const handleViewReport = () => {
    if (campaignId) {
      fetchCampaignData(campaignId);
    } else {
      alert('Seleccione una campaña primero');
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
        <Typography variant="h4" gutterBottom style={{ color: 'var(--color-primary)' }}>Reporte de Campaña</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Buscar Campaña por Nombre"
              type="text"
              fullWidth
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
              InputProps={{ style: { color: 'var(--color-primary)' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel style={{ color: 'var(--color-primary)' }}>Seleccionar Campaña</InputLabel>
              <Select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                style={{ color: 'var(--color-primary)' }}
              >
                <MenuItem value="">Seleccione una campaña</MenuItem>
                {campaigns.map((campaign) => (
                  <MenuItem key={campaign._id} value={campaign._id}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button onClick={handleSearchCampaign} variant="contained" style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Buscar
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button onClick={handleViewReport} variant="contained" style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Ver Reporte
            </Button>
            <Button onClick={generateReport} variant="contained" style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Generar Reporte
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {report && (
        <Box mt={4}>
          <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
            <Typography variant="h5" gutterBottom style={{ color: 'var(--color-primary)' }}>Detalles de la Campaña</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Nombre: {report.campaign.name}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Fecha de Inicio: {new Date(report.campaign.startDate).toLocaleDateString()}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Fecha de Fin: {new Date(report.campaign.endDate).toLocaleDateString()}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Ubicación: {report.campaign.location}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Coste Optometra: {report.campaign.coste_optometra}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Viáticos: {report.campaign.viaticos}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Gastos: {report.gastos}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Total Campaña: {report.totalCampaña}</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text)' }}>Ganancia: {report.ganancia}</Typography>
            <Typography variant="h6" gutterBottom style={{ color: 'var(--color-primary)' }}>Clientes</Typography>
            <ul>
              {report.clients.map(client => (
                <li key={client._id}>
                  <Typography variant="body2" style={{ color: 'var(--color-text)' }}>
                    {client.name} - {client.email} - {client.phone} - {client.edad} - {client.direccion}
                  </Typography>
                </li>
              ))}
            </ul>
            <Typography variant="h6" gutterBottom style={{ color: 'var(--color-primary)' }}>Ventas</Typography>
            <ul>
              {report.sales.map(sale => (
                <li key={sale._id}>
                  <Typography variant="body2" style={{ color: 'var(--color-text)' }}>
                    {sale.client.name} - {sale.product.name} - {sale.producto2 ? sale.producto2.name : 'N/A'} - {sale.luna_izquierda.descripcion} - {sale.luna_derecha.descripcion} - {sale.total}
                  </Typography>
                </li>
              ))}
            </ul>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Reporte;
// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, FormControl, TextField, InputLabel, Select, MenuItem, Box, FormControlLabel, Checkbox, Button } from '@mui/material';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [direccion, setDireccion] = useState(''); // Nuevo estado
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState('');
  const [farMeasurements, setFarMeasurements] = useState({ ojo_derecho: {}, ojo_izquierdo: {} });
  const [nearMeasurements, setNearMeasurements] = useState({ ojo_derecho: {}, ojo_izquierdo: {} });
  const [conditions, setConditions] = useState({
    miopia: false,
    astigmatismo: false,
    hipermetropia: false,
    presbicia: false,
  });
  const [notes, setNotes] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

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

    fetchClients();
    fetchCampaigns();
  }, [navigate]);

  const handleCreateOrUpdateClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const clientData = {
        name,
        email,
        phone,
        edad: age,
        direccion, // Nuevo campo
        campaign,
        medida_lejos: farMeasurements,
        medida_cerca: nearMeasurements,
        miopia: conditions.miopia,
        astigmatismo: conditions.astigmatismo,
        hipermetropia: conditions.hipermetropia,
        presbicia: conditions.presbicia,
        anotaciones: notes,
      };

      if (editingClient) {
        const response = await axios.put(
          `/api/clients/${editingClient._id}`,
          clientData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(clients.map(c => c._id === editingClient._id ? response.data : c));
        setEditingClient(null);
      } else {
        const response = await axios.post(
          '/api/clients',
          clientData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients([...clients, response.data]);
      }
      setName('');
      setEmail('');
      setPhone('');
      setAge('');
      setDireccion(''); // Resetear el campo
      setCampaign('');
      setFarMeasurements({ ojo_derecho: {}, ojo_izquierdo: {} });
      setNearMeasurements({ ojo_derecho: {}, ojo_izquierdo: {} });
      setConditions({
        miopia: false,
        astigmatismo: false,
        hipermetropia: false,
        presbicia: false,
      });
      setNotes('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClient = (client) => {
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAge(client.edad);
    setDireccion(client.direccion); // Nuevo campo
    setCampaign(client.campaign._id);
    setFarMeasurements(client.medida_lejos);
    setNearMeasurements(client.medida_cerca);
    setConditions({
      miopia: client.miopia,
      astigmatismo: client.astigmatismo,
      hipermetropia: client.hipermetropia,
      presbicia: client.presbicia,
    });
    setNotes(client.anotaciones);
    setEditingClient(client);
  };

  const handleDeleteClient = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(clients.filter(c => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMeasurementChange = (type, eye, field, value) => {
    if (type === 'far') {
      setFarMeasurements({
        ...farMeasurements,
        [eye]: {
          ...farMeasurements[eye],
          [field]: value,
        },
      });
    } else {
      setNearMeasurements({
        ...nearMeasurements,
        [eye]: {
          ...nearMeasurements[eye],
          [field]: value,
        },
      });
    }
  };

  const handleConditionChange = (condition) => {
    setConditions({
      ...conditions,
      [condition]: !conditions[condition],
    });
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
            <Typography variant="h4" gutterBottom style={{ color: 'var(--color-primary)' }}>Clientes</Typography>
            <form onSubmit={handleCreateOrUpdateClient}>
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
                  label="Correo"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Telefono"
                  type="text"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Edad"
                  type="number"
                  fullWidth
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Dirección"
                  type="text"
                  fullWidth
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Campaña</InputLabel>
                <Select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Campaign</MenuItem>
                  {campaigns.map(campaign => (
                    <MenuItem key={campaign._id} value={campaign._id}>{campaign.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mt={2}>
                <Typography variant="h6" gutterBottom style={{ color: 'var(--color-primary)' }}>Medida de Lejos</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom style={{ color: 'var(--color-primary)' }}>Ojo Derecho</Typography>
                    <TextField
                      label="Esfera"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_derecho.esfera || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'esfera', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Cilindro"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_derecho.cilindro || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'cilindro', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Eje"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_derecho.eje || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'eje', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="DIP"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_derecho.dip || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'dip', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="ADD"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_derecho.add || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'add', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom style={{ color: 'var(--color-primary)' }}>Ojo Izquierdo</Typography>
                    <TextField
                      label="Esfera"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_izquierdo.esfera || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'esfera', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Cilindro"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_izquierdo.cilindro || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'cilindro', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Eje"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_izquierdo.eje || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'eje', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="DIP"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_izquierdo.dip || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'dip', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="ADD"
                      type="number"
                      fullWidth
                      value={farMeasurements.ojo_izquierdo.add || ''}
                      onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'add', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mt={2}>
                <Typography variant="h6" gutterBottom style={{ color: 'var(--color-primary)' }}>Medida de Cerca</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom style={{ color: 'var(--color-primary)' }}>Ojo Derecho</Typography>
                    <TextField
                      label="Esfera"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_derecho.esfera || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'esfera', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Cilindro"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_derecho.cilindro || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'cilindro', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Eje"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_derecho.eje || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'eje', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="DIP"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_derecho.dip || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'dip', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="ADD"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_derecho.add || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'add', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom style={{ color: 'var(--color-primary)' }}>Ojo Izquierdo</Typography>
                    <TextField
                      label="Esfera"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_izquierdo.esfera || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'esfera', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Cilindro"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_izquierdo.cilindro || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'cilindro', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="Eje"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_izquierdo.eje || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'eje', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="DIP"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_izquierdo.dip || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'dip', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                    <TextField
                      label="ADD"
                      type="number"
                      fullWidth
                      value={nearMeasurements.ojo_izquierdo.add || ''}
                      onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'add', e.target.value)}
                      InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                      InputProps={{ style: { color: 'var(--color-primary)' } }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mt={2}>
                <Typography variant="h6" gutterBottom style={{ color: 'var(--color-primary)' }}>Observaciones</Typography>
                <FormControlLabel
                  control={<Checkbox checked={conditions.miopia} onChange={() => handleConditionChange('miopia')} />}
                  label="Miopia"
                  style={{ color: 'var(--color-primary)' }}
                />
                <FormControlLabel
                  control={<Checkbox checked={conditions.astigmatismo} onChange={() => handleConditionChange('astigmatismo')} />}
                  label="Astigmatismo"
                  style={{ color: 'var(--color-primary)' }}
                />
                <FormControlLabel
                  control={<Checkbox checked={conditions.hipermetropia} onChange={() => handleConditionChange('hipermetropia')} />}
                  label="Hipermetropia"
                  style={{ color: 'var(--color-primary)' }}
                />
                <FormControlLabel
                  control={<Checkbox checked={conditions.presbicia} onChange={() => handleConditionChange('presbicia')} />}
                  label="Presbicia"
                  style={{ color: 'var(--color-primary)' }}
                />
              </Box>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Anotaciones"
                  type="text"
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={4}
                  InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
                  InputProps={{ style: { color: 'var(--color-primary)' } }}
                />
              </FormControl>
              <Button type="submit" variant="contained" fullWidth style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                {editingClient ? 'Actualizar' : 'Crear'} Cliente
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom style={{ color: 'var(--color-primary)' }}>Lista de Clientes</Typography>
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
              <ul>
                {clients.map((client) => (
                  <li key={client._id} style={{ marginBottom: '1rem' }}>
                    <Typography variant="body1" style={{ color: 'var(--color-text)' }}>{client.name}</Typography>
                    <Button onClick={() => handleEditClient(client)} style={{ marginLeft: '1rem', backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteClient(client._id)} style={{ marginLeft: '1rem', backgroundColor: 'var(--color-accent-dark)', color: 'white' }}>
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

export default Clients;
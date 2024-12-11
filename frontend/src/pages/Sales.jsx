// src/pages/Sales.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Grid, Checkbox } from '@mui/material';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [lunas, setLunas] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [producto2, setProducto2] = useState('');
  const [status, setStatus] = useState('reserved');
  const [campaign, setCampaign] = useState('');
  const [lunaIzquierda, setLunaIzquierda] = useState('');
  const [lunaDerecha, setLunaDerecha] = useState('');
  const [selectedTratamientos, setSelectedTratamientos] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editingSale, setEditingSale] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [productsResponse, lunasResponse, tratamientosResponse, campaignsResponse, salesResponse] = await Promise.all([
          axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/lunas', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/tratamientos', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/campaigns/active', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/sales', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setProducts(productsResponse.data);
        setLunas(lunasResponse.data);
        setTratamientos(tratamientosResponse.data);
        setCampaigns(campaignsResponse.data);
        setSales(salesResponse.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const fetchClientsByCampaign = async (campaignId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`/api/sales/clients/${campaignId}`, {
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

  useEffect(() => {
    let total = 0;

    if (product) {
      const selectedProduct = products.find(p => p._id === product);
      if (selectedProduct) {
        total += selectedProduct.price;
      }
    }

    if (producto2) {
      const selectedProduct2 = products.find(p => p._id === producto2);
      if (selectedProduct2) {
        total += selectedProduct2.price;
      }
    }

    if (lunaIzquierda) {
      const selectedLunaIzquierda = lunas.find(l => l._id === lunaIzquierda);
      if (selectedLunaIzquierda) {
        total += selectedLunaIzquierda.precio;
      }
    }

    if (lunaDerecha) {
      const selectedLunaDerecha = lunas.find(l => l._id === lunaDerecha);
      if (selectedLunaDerecha) {
        total += selectedLunaDerecha.precio;
      }
    }

    selectedTratamientos.forEach(tratamientoId => {
      const selectedTratamiento = tratamientos.find(t => t._id === tratamientoId);
      if (selectedTratamiento) {
        total += selectedTratamiento.precio;
      }
    });

    setTotalPrice(total);
  }, [product, producto2, lunaIzquierda, lunaDerecha, selectedTratamientos, products, lunas, tratamientos]);

  const handleCampaignChange = (e) => {
    const selectedCampaign = e.target.value;
    setCampaign(selectedCampaign);
    fetchClientsByCampaign(selectedCampaign);
  };

  const handleCreateOrUpdateSale = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!product && !producto2 && !lunaIzquierda && !lunaDerecha) {
      setError('Debe seleccionar al menos un producto o una luna.');
      return;
    }

    if (!client || !campaign) {
      setError('Debe seleccionar un cliente y una campaña.');
      return;
    }

    try {
      const saleData = {
        client,
        product,
        producto2: producto2 || undefined,
        status,
        campaign,
        luna_izquierda: lunaIzquierda,
        luna_derecha: lunaDerecha,
        tratamientos: selectedTratamientos.length > 0 ? selectedTratamientos : undefined,
        total: totalPrice,
      };

      let response;
      if (editingSale) {
        response = await axios.put(
          `/api/sales/${editingSale._id}`,
          saleData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSales(sales.map(s => s._id === editingSale._id ? response.data : s));
        setEditingSale(null);
      } else {
        response = await axios.post(
          '/api/sales',
          saleData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSales([...sales, response.data]);
      }
      setClient('');
      setProduct('');
      setProducto2('');
      setStatus('reserved');
      setCampaign('');
      setLunaIzquierda('');
      setLunaDerecha('');
      setSelectedTratamientos([]);
      setTotalPrice(0);
      setError('');
    } catch (error) {
      console.error('Error creating or updating sale:', error);
      setError('Error al crear o actualizar la venta.');
    }
  };

  const handleEditSale = (sale) => {
    setClient(sale.client._id);
    setProduct(sale.product._id);
    setProducto2(sale.producto2 ? sale.producto2._id : '');
    setStatus(sale.status);
    setCampaign(sale.campaign._id);
    setLunaIzquierda(sale.luna_izquierda._id);
    setLunaDerecha(sale.luna_derecha._id);
    setSelectedTratamientos(sale.tratamientos.map(t => t._id));
    setTotalPrice(sale.total);
    setEditingSale(sale);
  };

  const handleDeleteSale = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(sales.filter(s => s._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleTratamientoChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTratamientos(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
            <Typography variant="h4" gutterBottom style={{ color: 'var(--color-primary)' }}>Ventas</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleCreateOrUpdateSale}>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Campaña</InputLabel>
                <Select
                  value={campaign}
                  onChange={handleCampaignChange}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Campaign</MenuItem>
                  {campaigns.map(campaign => (
                    <MenuItem key={campaign._id} value={campaign._id}>{campaign.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Cliente</InputLabel>
                <Select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Client</MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client._id} value={client._id}>{client.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Montura</InputLabel>
                <Select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {products.map(product => (
                    <MenuItem key={product._id} value={product._id} disabled={product.stock === 0}>
                      {product.name} (Stock: {product.stock})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Montura extra</InputLabel>
                <Select
                  value={producto2}
                  onChange={(e) => setProducto2(e.target.value)}
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Product 2</MenuItem>
                  {products.map(product => (
                    <MenuItem key={product._id} value={product._id} disabled={product.stock === 0}>
                      {product.name} (Stock: {product.stock})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="reserved">Reserved</MenuItem>
                  <MenuItem value="to deliver">To Deliver</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Luna Izquierda</InputLabel>
                <Select
                  value={lunaIzquierda}
                  onChange={(e) => setLunaIzquierda(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Luna Izquierda</MenuItem>
                  {lunas.map(luna => (
                    <MenuItem key={luna._id} value={luna._id} disabled={luna.stock === 0}>
                      {luna.descripcion} (Stock: {luna.stock})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Luna Derecha</InputLabel>
                <Select
                  value={lunaDerecha}
                  onChange={(e) => setLunaDerecha(e.target.value)}
                  required
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MenuItem value="">Select Luna Derecha</MenuItem>
                  {lunas.map(luna => (
                    <MenuItem key={luna._id} value={luna._id} disabled={luna.stock === 0}>
                      {luna.descripcion} (Stock: {luna.stock})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: 'var(--color-primary)' }}>Tratamientos</InputLabel>
                <Select
                  multiple
                  value={selectedTratamientos}
                  onChange={handleTratamientoChange}
                  style={{ color: 'var(--color-primary)' }}
                  renderValue={(selected) => selected.map(id => tratamientos.find(t => t._id === id)?.nombre).join(', ')}
                >
                  {tratamientos.map(tratamiento => (
                    <MenuItem key={tratamiento._id} value={tratamiento._id}>
                      <Checkbox checked={selectedTratamientos.indexOf(tratamiento._id) > -1} />
                      <Typography>{tratamiento.nombre}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h6" gutterBottom style={{ color: 'var(--color-primary)' }}>Total: S/{totalPrice}</Typography>
              <Button type="submit" variant="contained" fullWidth style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                {editingSale ? 'Actualizar' : 'Crear'} Venta
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom style={{ color: 'var(--color-primary)' }}>Lista de Ventas</Typography>
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
              <ul>
                {sales.map((sale) => (
                  <li key={sale._id} style={{ marginBottom: '1rem' }}>
                    <Typography variant="body1" style={{ color: 'var(--color-text)' }}>
                      {sale.client?.name || 'N/A'} - {sale.product?.name || 'N/A'} - {sale.producto2 ? sale.producto2.name : 'N/A'} - {sale.luna_izquierda?.descripcion || 'N/A'} - {sale.luna_derecha?.descripcion || 'N/A'} - {sale.status} - ${sale.total}
                    </Typography>
                    <Button onClick={() => handleEditSale(sale)} style={{ marginLeft: '1rem', backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteSale(sale._id)} style={{ marginLeft: '1rem', backgroundColor: 'var(--color-accent-dark)', color: 'white' }}>
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

export default Sales;
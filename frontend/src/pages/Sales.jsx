// src/pages/Sales.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        const [productsResponse, lunasResponse, tratamientosResponse, campaignsResponse] = await Promise.all([
          axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/lunas', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/tratamientos', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/campaigns/active', { headers: { Authorization: `Bearer ${token}` } }), // Obtener solo campañas activas
        ]);

        setProducts(productsResponse.data);
        setLunas(lunasResponse.data);
        setTratamientos(tratamientosResponse.data);
        setCampaigns(campaignsResponse.data);
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

      if (editingSale) {
        const response = await axios.put(
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
        const response = await axios.post(
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

  const handleTratamientoChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTratamientos(value);
  };

  return (
    <div>
      <h1>Sales</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreateOrUpdateSale}>
        <div>
          <label>Campaña</label>
          <select value={campaign} onChange={handleCampaignChange} required>
            <option value="">Select Campaign</option>
            {campaigns.map(campaign => (
              <option key={campaign._id} value={campaign._id}>{campaign.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Cliente</label>
          <select value={client} onChange={(e) => setClient(e.target.value)} required>
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Montura</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)} required>
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product._id} value={product._id} disabled={product.stock === 0}>
                {product.name} (Stock: {product.stock})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Montura extra</label>
          <select value={producto2} onChange={(e) => setProducto2(e.target.value)}>
            <option value="">Select Product 2</option>
            {products.map(product => (
              <option key={product._id} value={product._id} disabled={product.stock === 0}>
                {product.name} (Stock: {product.stock})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="reserved">Reserved</option>
            <option value="to deliver">To Deliver</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div>
          <label>Luna Izquierda</label>
          <select value={lunaIzquierda} onChange={(e) => setLunaIzquierda(e.target.value)} required>
            <option value="">Select Luna Izquierda</option>
            {lunas.map(luna => (
              <option key={luna._id} value={luna._id} disabled={luna.stock === 0}>
                {luna.descripcion} (Stock: {luna.stock})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Luna Derecha</label>
          <select value={lunaDerecha} onChange={(e) => setLunaDerecha(e.target.value)} required>
            <option value="">Select Luna Derecha</option>
            {lunas.map(luna => (
              <option key={luna._id} value={luna._id} disabled={luna.stock === 0}>
                {luna.descripcion} (Stock: {luna.stock})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Tratamientos</label>
          <select multiple value={selectedTratamientos} onChange={handleTratamientoChange}>
            {tratamientos.map(tratamiento => (
              <option key={tratamiento._id} value={tratamiento._id}>{tratamiento.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Total: S/{totalPrice}</label>
        </div>
        <button type="submit">{editingSale ? 'Update' : 'Create'} Sale</button>
      </form>
      <ul>
        {sales.map((sale) => (
          <li key={sale._id}>
            {sale.client.name} - {sale.product.name} - {sale.producto2 ? sale.producto2.name : 'N/A'} - {sale.luna_izquierda.descripcion} - {sale.luna_derecha.descripcion} - {sale.status} - ${sale.total}
            <button onClick={() => handleEditSale(sale)}>Edit</button>
            <button onClick={() => handleDeleteSale(sale._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
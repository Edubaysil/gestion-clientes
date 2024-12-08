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
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('reserved');
  const [campaign, setCampaign] = useState('');
  const [luna, setLuna] = useState('');
  const [editingSale, setEditingSale] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/sales', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSales(response.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

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

    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
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

    const fetchLunas = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/lunas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLunas(response.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchSales();
    fetchClients();
    fetchProducts();
    fetchCampaigns();
    fetchLunas();
  }, [navigate]);

  const handleCreateOrUpdateSale = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const saleData = {
        client,
        product,
        quantity,
        status,
        campaign,
        luna, // Nuevo campo
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
      setQuantity('');
      setStatus('reserved');
      setCampaign('');
      setLuna(''); // Nuevo campo
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSale = (sale) => {
    setClient(sale.client._id);
    setProduct(sale.product._id);
    setQuantity(sale.quantity);
    setStatus(sale.status);
    setCampaign(sale.campaign._id);
    setLuna(sale.luna._id); // Nuevo campo
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

  return (
    <div>
      <h1>Sales</h1>
      <form onSubmit={handleCreateOrUpdateSale}>
        <div>
          <label>Client</label>
          <select value={client} onChange={(e) => setClient(e.target.value)} required>
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Product</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)} required>
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
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
          <label>Campaign</label>
          <select value={campaign} onChange={(e) => setCampaign(e.target.value)} required>
            <option value="">Select Campaign</option>
            {campaigns.map(campaign => (
              <option key={campaign._id} value={campaign._id}>{campaign.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Luna</label>
          <select value={luna} onChange={(e) => setLuna(e.target.value)} required>
            <option value="">Select Luna</option>
            {lunas.map(luna => (
              <option key={luna._id} value={luna._id}>{luna.descripcion}</option>
            ))}
          </select>
        </div>
        <button type="submit">{editingSale ? 'Update' : 'Create'} Sale</button>
      </form>
      <ul>
        {sales.map((sale) => (
          <li key={sale._id}>
            {sale.client.name} - {sale.product.name} - {sale.luna.descripcion} - {sale.status}
            <button onClick={() => handleEditSale(sale)}>Edit</button>
            <button onClick={() => handleDeleteSale(sale._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
// src/pages/Sales.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('reserved');
  const [campaign, setCampaign] = useState('');
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

    fetchSales();
  }, [navigate]);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        '/api/sales',
        { client, product, quantity, status, campaign },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSales([...sales, response.data]);
      setClient('');
      setProduct('');
      setQuantity('');
      setStatus('reserved');
      setCampaign('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Sales</h1>
      <form onSubmit={handleCreateSale}>
        <div>
          <label>Client</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
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
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Sale</button>
      </form>
      <ul>
        {sales.map((sale) => (
          <li key={sale._id}>{sale.client} - {sale.product} - {sale.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
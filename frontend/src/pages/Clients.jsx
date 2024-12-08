// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [campaign, setCampaign] = useState('');
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

    fetchClients();
  }, [navigate]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        '/api/clients',
        { name, email, phone, campaign },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClients([...clients, response.data]);
      setName('');
      setEmail('');
      setPhone('');
      setCampaign('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Clients</h1>
      <form onSubmit={handleCreateClient}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
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
        <button type="submit">Create Client</button>
      </form>
      <ul>
        {clients.map((client) => (
          <li key={client._id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
// src/pages/Campaigns.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Campaña</h1>
      <form onSubmit={handleCreateOrUpdateCampaign}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha Inicio</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estado</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="active">Activo</option>
            <option value="closed">Cerrado</option>
          </select>
        </div>
        <div>
          <label>Ubicación</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Coste Optometra</label>
          <input
            type="number"
            value={costeOptometra}
            onChange={(e) => setCosteOptometra(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Viáticos</label>
          <input
            type="number"
            value={viaticos}
            onChange={(e) => setViaticos(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Origen</label>
          <select value={origen} onChange={(e) => setOrigen(e.target.value)} required>
            <option value="por convenio">Por Convenio</option>
            <option value="por gestión">Por Gestión</option>
          </select>
        </div>
        <button type="submit">{editingCampaign ? 'Update' : 'Create'} Campaign</button>
      </form>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign._id}>
            {campaign.name}
            <button onClick={() => handleEditCampaign(campaign)}>Edit</button>
            <button onClick={() => handleDeleteCampaign(campaign._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Campaigns;
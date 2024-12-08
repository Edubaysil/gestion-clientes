// src/pages/Campaigns.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
      if (editingCampaign) {
        const response = await axios.put(
          `/api/campaigns/${editingCampaign._id}`,
          { name, startDate, endDate },
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
          { name, startDate, endDate },
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCampaign = (campaign) => {
    setName(campaign.name);
    setStartDate(campaign.startDate);
    setEndDate(campaign.endDate);
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
      <h1>Campaigns</h1>
      <form onSubmit={handleCreateOrUpdateCampaign}>
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
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
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
// src/pages/Reporte.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Reporte de Campaña</h1>
      <div>
        <label>Buscar Campaña por Nombre</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <button onClick={handleSearchCampaign}>Buscar</button>
      </div>
      <div>
        <label>Seleccionar Campaña</label>
        <select
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
        >
          <option value="">Seleccione una campaña</option>
          {campaigns.map((campaign) => (
            <option key={campaign._id} value={campaign._id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleViewReport}>Ver Reporte</button>
      <button onClick={generateReport}>Generar Reporte</button>
      {report && (
        <div>
          <h2>Detalles de la Campaña</h2>
          <p>Nombre: {report.campaign.name}</p>
          <p>Fecha de Inicio: {new Date(report.campaign.startDate).toLocaleDateString()}</p>
          <p>Fecha de Fin: {new Date(report.campaign.endDate).toLocaleDateString()}</p>
          <p>Ubicación: {report.campaign.location}</p>
          <p>Coste Optometra: {report.campaign.coste_optometra}</p>
          <p>Viáticos: {report.campaign.viaticos}</p>
          <p>Gastos: {report.gastos}</p>
          <p>Total Campaña: {report.totalCampaña}</p>
          <p>Ganancia: {report.ganancia}</p>
          <h3>Clientes</h3>
          <ul>
            {report.clients.map(client => (
              <li key={client._id}>
                {client.name} - {client.email} - {client.phone} - {client.edad} - {client.direccion}
              </li>
            ))}
          </ul>
          <h3>Ventas</h3>
          <ul>
            {report.sales.map(sale => (
              <li key={sale._id}>
                {sale.client.name} - {sale.product.name} - {sale.producto2 ? sale.producto2.name : 'N/A'} - {sale.luna_izquierda.descripcion} - {sale.luna_derecha.descripcion} - {sale.total}
                <select value={sale.status} onChange={(e) => handleStatusChange(sale._id, e.target.value)}>
                  <option value="reserved">Reserved</option>
                  <option value="to deliver">To Deliver</option>
                  <option value="delivered">Delivered</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reporte;
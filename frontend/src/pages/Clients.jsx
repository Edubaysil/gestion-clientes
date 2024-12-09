// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Clients</h1>
      <form onSubmit={handleCreateOrUpdateClient}>
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
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Telefono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Edad</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div>
          <label>Campaña</label>
          <select value={campaign} onChange={(e) => setCampaign(e.target.value)} required>
            <option value="">Select Campaign</option>
            {campaigns.map(campaign => (
              <option key={campaign._id} value={campaign._id}>{campaign.name}</option>
            ))}
          </select>
        </div>
        <div>
          <h3>Medida de Lejos</h3>
          <div>
            <h4>Ojo Derecho</h4>
            <label>Esfera</label>
            <input
              type="number"
              value={farMeasurements.ojo_derecho.esfera || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'esfera', e.target.value)}
            />
            <label>Cilindro</label>
            <input
              type="number"
              value={farMeasurements.ojo_derecho.cilindro || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'cilindro', e.target.value)}
            />
            <label>Eje</label>
            <input
              type="number"
              value={farMeasurements.ojo_derecho.eje || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'eje', e.target.value)}
            />
            <label>DIP</label>
            <input
              type="number"
              value={farMeasurements.ojo_derecho.dip || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'dip', e.target.value)}
            />
            <label>ADD</label>
            <input
              type="number"
              value={farMeasurements.ojo_derecho.add || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_derecho', 'add', e.target.value)}
            />
          </div>
          <div>
            <h4>Ojo Izquierdo</h4>
            <label>Esfera</label>
            <input
              type="number"
              value={farMeasurements.ojo_izquierdo.esfera || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'esfera', e.target.value)}
            />
            <label>Cilindro</label>
            <input
              type="number"
              value={farMeasurements.ojo_izquierdo.cilindro || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'cilindro', e.target.value)}
            />
            <label>Eje</label>
            <input
              type="number"
              value={farMeasurements.ojo_izquierdo.eje || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'eje', e.target.value)}
            />
            <label>DIP</label>
            <input
              type="number"
              value={farMeasurements.ojo_izquierdo.dip || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'dip', e.target.value)}
            />
            <label>ADD</label>
            <input
              type="number"
              value={farMeasurements.ojo_izquierdo.add || ''}
              onChange={(e) => handleMeasurementChange('far', 'ojo_izquierdo', 'add', e.target.value)}
            />
          </div>
        </div>
        <div>
          <h3>Medida de Cerca</h3>
          <div>
            <h4>Ojo Derecho</h4>
            <label>Esfera</label>
            <input
              type="number"
              value={nearMeasurements.ojo_derecho.esfera || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'esfera', e.target.value)}
            />
            <label>Cilindro</label>
            <input
              type="number"
              value={nearMeasurements.ojo_derecho.cilindro || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'cilindro', e.target.value)}
            />
            <label>Eje</label>
            <input
              type="number"
              value={nearMeasurements.ojo_derecho.eje || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'eje', e.target.value)}
            />
            <label>DIP</label>
            <input
              type="number"
              value={nearMeasurements.ojo_derecho.dip || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'dip', e.target.value)}
            />
            <label>ADD</label>
            <input
              type="number"
              value={nearMeasurements.ojo_derecho.add || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_derecho', 'add', e.target.value)}
            />
          </div>
          <div>
            <h4>Ojo Izquierdo</h4>
            <label>Esfera</label>
            <input
              type="number"
              value={nearMeasurements.ojo_izquierdo.esfera || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'esfera', e.target.value)}
            />
            <label>Cilindro</label>
            <input
              type="number"
              value={nearMeasurements.ojo_izquierdo.cilindro || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'cilindro', e.target.value)}
            />
            <label>Eje</label>
            <input
              type="number"
              value={nearMeasurements.ojo_izquierdo.eje || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'eje', e.target.value)}
            />
            <label>DIP</label>
            <input
              type="number"
              value={nearMeasurements.ojo_izquierdo.dip || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'dip', e.target.value)}
            />
            <label>ADD</label>
            <input
              type="number"
              value={nearMeasurements.ojo_izquierdo.add || ''}
              onChange={(e) => handleMeasurementChange('near', 'ojo_izquierdo', 'add', e.target.value)}
            />
          </div>
        </div>
        <div>
          <h3>Condiciones</h3>
          <label>
            <input
              type="checkbox"
              checked={conditions.miopia}
              onChange={() => handleConditionChange('miopia')}
            />
            Miopia
          </label>
          <label>
            <input
              type="checkbox"
              checked={conditions.astigmatismo}
              onChange={() => handleConditionChange('astigmatismo')}
            />
            Astigmatismo
          </label>
          <label>
            <input
              type="checkbox"
              checked={conditions.hipermetropia}
              onChange={() => handleConditionChange('hipermetropia')}
            />
            Hipermetropia
          </label>
          <label>
            <input
              type="checkbox"
              checked={conditions.presbicia}
              onChange={() => handleConditionChange('presbicia')}
            />
            Presbicia
          </label>
        </div>
        <div>
          <label>Anotaciones</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength="300"
          />
        </div>
        <button type="submit">{editingClient ? 'Update' : 'Create'} Client</button>
      </form>
      <ul>
        {clients.map((client) => (
          <li key={client._id}>
            {client.name}
            <button onClick={() => handleEditClient(client)}>Edit</button>
            <button onClick={() => handleDeleteClient(client._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
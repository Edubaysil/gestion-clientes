// src/pages/Tratamientos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tratamientos = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editingTratamiento, setEditingTratamiento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTratamientos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/tratamientos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTratamientos(response.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchTratamientos();
  }, [navigate]);

  const handleCreateOrUpdateTratamiento = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const tratamientoData = {
        nombre,
        precio,
      };

      if (editingTratamiento) {
        const response = await axios.put(
          `/api/tratamientos/${editingTratamiento._id}`,
          tratamientoData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTratamientos(tratamientos.map(t => t._id === editingTratamiento._id ? response.data : t));
        setEditingTratamiento(null);
      } else {
        const response = await axios.post(
          '/api/tratamientos',
          tratamientoData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTratamientos([...tratamientos, response.data]);
      }
      setNombre('');
      setPrecio('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTratamiento = (tratamiento) => {
    setNombre(tratamiento.nombre);
    setPrecio(tratamiento.precio);
    setEditingTratamiento(tratamiento);
  };

  const handleDeleteTratamiento = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/tratamientos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTratamientos(tratamientos.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Tratamientos</h1>
      <form onSubmit={handleCreateOrUpdateTratamiento}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editingTratamiento ? 'Update' : 'Create'} Tratamiento</button>
      </form>
      <ul>
        {tratamientos.map((tratamiento) => (
          <li key={tratamiento._id}>
            {tratamiento.nombre} - {tratamiento.precio}
            <button onClick={() => handleEditTratamiento(tratamiento)}>Edit</button>
            <button onClick={() => handleDeleteTratamiento(tratamiento._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tratamientos;
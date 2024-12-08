// src/pages/Lunas.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Lunas = () => {
  const [lunas, setLunas] = useState([]);
  const [material, setMaterial] = useState('');
  const [graduacion, setGraduacion] = useState('');
  const [color, setColor] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [editingLuna, setEditingLuna] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchLunas();
  }, [navigate]);

  const handleCreateOrUpdateLuna = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const lunaData = {
        material,
        graduacion,
        color,
        precio,
        stock,
      };

      if (editingLuna) {
        const response = await axios.put(
          `/api/lunas/${editingLuna._id}`,
          lunaData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLunas(lunas.map(l => l._id === editingLuna._id ? response.data : l));
        setEditingLuna(null);
      } else {
        const response = await axios.post(
          '/api/lunas',
          lunaData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLunas([...lunas, response.data]);
      }
      setMaterial('');
      setGraduacion('');
      setColor('');
      setPrecio('');
      setStock('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLuna = (luna) => {
    setMaterial(luna.material);
    setGraduacion(luna.graduacion);
    setColor(luna.color);
    setPrecio(luna.precio);
    setStock(luna.stock);
    setEditingLuna(luna);
  };

  const handleDeleteLuna = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/lunas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLunas(lunas.filter(l => l._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Lunas</h1>
      <form onSubmit={handleCreateOrUpdateLuna}>
        <div>
          <label>Material</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Graduación</label>
          <input
            type="text"
            value={graduacion}
            onChange={(e) => setGraduacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
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
        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editingLuna ? 'Update' : 'Create'} Luna</button>
      </form>
      <ul>
        {lunas.map((luna) => (
          <li key={luna._id}>
            {luna.material} - {luna.graduacion} - {luna.color} - {luna.precio} - {luna.stock}
            <button onClick={() => handleEditLuna(luna)}>Edit</button>
            <button onClick={() => handleDeleteLuna(luna._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lunas;
// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import logo from '../../assets/images/Logo.svg'; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/campaigns');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: 'var(--color-background)' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '1rem' }} />
          <Typography variant="h4" gutterBottom style={{ color: 'var(--color-primary)' }}>Inicio de Sesión</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Nombre de Usuario"
              type="text"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
              InputProps={{ style: { color: 'var(--color-primary)' } }}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ style: { color: 'var(--color-primary)' } }}
              InputProps={{ style: { color: 'var(--color-primary)' } }}
            />
            <Button type="submit" variant="contained" fullWidth style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Iniciar Sesión
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
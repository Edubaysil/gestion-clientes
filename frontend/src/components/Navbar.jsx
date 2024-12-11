// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: 'var(--color-primary)' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Gestión de Clientes
        </Typography>
        <Button color="inherit" component={Link} to="/campaigns">Campañas</Button>
        <Button color="inherit" component={Link} to="/clients">Clientes</Button>
        <Button color="inherit" component={Link} to="/sales">Ventas</Button>
        <Button color="inherit" component={Link} to="/reporte">Reporte</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/campaigns">Campañas</Link></li>
        <li><Link to="/clients">Clientes</Link></li>
        <li><Link to="/sales">Ventas</Link></li>
        <li><Link to="/reporte">Reporte</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
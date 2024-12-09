// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/campaigns">Camañas</Link></li>
        <li><Link to="/clients">Clientes</Link></li>
        <li><Link to="/sales">Ventas</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/campaigns">Campaigns</Link></li>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/sales">Sales</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
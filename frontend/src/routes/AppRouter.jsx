// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login/Login';
import Campaigns from '../pages/Campaigns';
import Clients from '../pages/Clients';
import Products from '../pages/Products';
import Sales from '../pages/Sales';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/products" element={<Products />} />
      <Route path="/sales" element={<Sales />} />
    </Routes>
  );
};
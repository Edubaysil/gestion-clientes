// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Clients from '../pages/Clients';
import Campaigns from '../pages/Campaigns';
import Products from '../pages/Products';
import Sales from '../pages/Sales';
import Lunas from '../pages/Lunas';
import Tratamientos from '../pages/Tratamientos';
import NoNavbarLayout from '../layouts/NoNavbarLayout';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<NoNavbarLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        } />
        <Route path="/lunas" element={
          <ProtectedRoute>
            <Lunas />
          </ProtectedRoute>
        } />
        <Route path="/tratamientos" element={
          <ProtectedRoute>
            <Tratamientos />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};
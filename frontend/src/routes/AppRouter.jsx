// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login/Login';
import Campaigns from '../pages/Campaigns';
import Clients from '../pages/Clients';
import Products from '../pages/Products';
import Sales from '../pages/Sales';
import Lunas from '../pages/Lunas';
import Tratamientos from '../pages/Tratamientos';
import ProtectedRoute from '../components/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route path="/campaigns" element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route path="/sales" element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        }
      />
      <Route path="/lunas" element={
          <ProtectedRoute>
            <Lunas />
          </ProtectedRoute>
        }
      />
      <Route path="/tratamientos" element={
          <ProtectedRoute>
            <Tratamientos />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
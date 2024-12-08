// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login/Login';
import Campaigns from '../pages/Campaigns';
import Clients from '../pages/Clients';
import Products from '../pages/Products';
import Sales from '../pages/Sales';
import ProtectedRoute from '../components/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
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
    </Routes>
  );
};
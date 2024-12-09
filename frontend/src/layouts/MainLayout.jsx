// src/layouts/MainLayout.jsx
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
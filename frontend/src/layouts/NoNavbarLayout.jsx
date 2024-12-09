// src/layouts/NoNavbarLayout.jsx
import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const NoNavbarLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default NoNavbarLayout;
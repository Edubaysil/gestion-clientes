// src/containers/App.jsx
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { AppRouter } from '../routes/AppRouter';

const App = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <AppRouter />
    </div>
  );
};

export default App;
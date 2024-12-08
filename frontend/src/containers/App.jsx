// src/containers/App.jsx
import React from 'react';
import Header from '../components/Header';
import { AppRouter } from '../routes/AppRouter';

const App = () => {
  return (
    <div>
      <Header />
      <AppRouter />
    </div>
  );
};

export default App;
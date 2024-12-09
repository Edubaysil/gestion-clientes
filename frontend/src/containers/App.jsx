// src/containers/App.jsx
import React from 'react';
import { AppRouter } from '../routes/AppRouter';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();

  return (
    <div>
      <AppRouter />
    </div>
  );
};

export default App;
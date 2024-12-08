// src/components/Login/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('shows error message on invalid credentials', async () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'invalid' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'invalid' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});
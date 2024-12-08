// src/pages/Campaigns.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Campaigns from './Campaigns';

test('renders campaigns page', () => {
  render(
    <BrowserRouter>
      <Campaigns />
    </BrowserRouter>
  );

  expect(screen.getByText(/campaigns/i)).toBeInTheDocument();
});

test('creates a new campaign', async () => {
  render(
    <BrowserRouter>
      <Campaigns />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Campaign' } });
  fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-01-01' } });
  fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-31' } });
  fireEvent.click(screen.getByRole('button', { name: /create campaign/i }));

  expect(await screen.findByText(/new campaign/i)).toBeInTheDocument();
});
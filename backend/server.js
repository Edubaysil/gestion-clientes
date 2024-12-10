// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/gestion-clientes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userRoutes = require('./routes/users');
const campaignRoutes = require('./routes/campaigns');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const lunasRoutes = require('./routes/lunas');
const tratamientoRoutes = require('./routes/tratamientos');
const reporteRoutes = require('./routes/reportes');

app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/lunas', lunasRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/reportes', reporteRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const marketRoutes = require('../routes/market'); // Ensure correct relative path

const app = express();

// ✅ Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', // ✅ Allow frontend dev server
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// ✅ Mount all API routes under /api
app.use('/api', marketRoutes);

// ✅ Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;

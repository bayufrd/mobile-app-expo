const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./db/mysql');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  const database = await testConnection();

  res.json({
    status: 'ok',
    database,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/students', studentRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    details: err.details || null,
  });
});

app.listen(port, () => {
  console.log(`Student API running on port ${port}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const { errorHandler } = require('./middleware/errorHandler');
const analyzeRoutes = require('./routes/analyzeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Ensure uploads directory exists
const uploadDir = path.resolve(config.upload.dir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Auto Bug Fixer & Refactor AI',
    model: config.ibm.modelId,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Auto Bug Fixer backend running on port ${config.port}`);
  console.log(`IBM Model: ${config.ibm.modelId}`);
  console.log(`Health: http://localhost:${config.port}/health`);
});

module.exports = app;

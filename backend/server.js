require('dotenv').config();
console.log('Environment variables loaded:', {
  port: process.env.PORT,
  frontendUrl: process.env.FRONTEND_URL,
  hasApiKey: !!process.env.OPENAI_API_KEY
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aiRoutes = require('./routes/ai');
const documentRoutes = require('./routes/documents');

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('/api/ai/generate-claims');
  console.log('/api/ai/get-claim-evidence');
  console.log('/api/documents/*');
});

module.exports = app; 
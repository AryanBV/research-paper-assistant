// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const { testConnection } = require('./config/db');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads directory statically
app.use('/uploads', express.static(uploadsDir));

// Database connection test
(async () => {
  const connected = await testConnection();
  if (connected) {
    // Make sure to import and call the initialization function
    const { initializeDatabase } = require('./utils/db-init');
    await initializeDatabase();
    console.log('Database tables initialization complete');
  }
})();

// Import routes
const apiRoutes = require('./routes/api');

// API routes - make sure they're defined BEFORE the static/wildcard routes
app.use('/api', apiRoutes);

// API status route
app.get('/api/status', (req, res) => {
  res.send('Research Paper Assistant API is running');
});

// Static file serving and catch-all routes for React app - MUST be AFTER API routes
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode, serving static files');
  
  // First, serve the static files from React build
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  
  // Then, serve the index.html for any unknown paths (React router will handle these)
  app.get('*', (req, res) => {
    console.log('Serving React app for path:', req.path);
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
} else {
  // In development, just show API status
  app.get('/', (req, res) => {
    res.send('Research Paper Assistant API is running - Development Mode');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Static files path: ${path.resolve(__dirname, '../client/build')}`);
});
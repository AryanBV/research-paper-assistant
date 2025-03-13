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
  console.log(`Created uploads directory at: ${uploadsDir}`);
}

// Log uploads directory access information
console.log(`Uploads directory: ${uploadsDir}`);
try {
  // Try to write a test file to verify writability
  const testFile = path.join(uploadsDir, '.permissions-test');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('Uploads directory is writable');
} catch (error) {
  console.error('Warning: Uploads directory is not writable:', error.message);
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
  } else {
    console.warn('Database connection failed. Some features may not work.');
  }
})();

// Import routes
const apiRoutes = require('./routes/api');

// API routes - make sure they're defined BEFORE the static/wildcard routes
app.use('/api', apiRoutes);

// API status route - useful for health checks
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Research Paper Assistant API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Static file serving and catch-all routes for React app - MUST be AFTER API routes
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode, serving static files');
  
  // Define client build path
  const clientBuildPath = path.resolve(__dirname, '../client/build');
  
  // Check if client build directory exists
  if (fs.existsSync(clientBuildPath)) {
    console.log(`Client build directory found at: ${clientBuildPath}`);
    
    // First, serve the static files from React build
    app.use(express.static(clientBuildPath));
    
    // Then, serve the index.html for any unknown paths (React router will handle these)
    app.get('*', (req, res) => {
      console.log(`Serving React app for path: ${req.path}`);
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    console.error(`Client build directory not found at: ${clientBuildPath}`);
    
    // Fallback route when client build is missing
    app.get('*', (req, res) => {
      res.status(500).send(`
        <html>
          <head><title>Server Error</title></head>
          <body>
            <h1>Server Configuration Error</h1>
            <p>The client build files are missing. Please make sure to build the client before deploying.</p>
          </body>
        </html>
      `);
    });
  }
} else {
  // In development, just show API status
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>Research Paper Assistant API - Dev</title></head>
        <body>
          <h1>Research Paper Assistant API is running</h1>
          <p>Development Mode</p>
          <p>API Status: <a href="/api/status">/api/status</a></p>
        </body>
      </html>
    `);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Static files path: ${path.resolve(__dirname, '../client/build')}`);
});
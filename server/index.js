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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// Use routes
app.use('/api', apiRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Research Paper Assistant API is running');
});

// Production mode configuration - MOVED UP FROM BOTTOM
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle any requests that don't match the above
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// server/routes/api.js
const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsDir}`);
}

// Configure multer storage with error handling
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Ensure uploads directory exists before storing files
    if (!fs.existsSync(uploadsDir)) {
      return cb(new Error(`Uploads directory does not exist: ${uploadsDir}`), false);
    }
    
    try {
      // Check if directory is writable
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      cb(null, uploadsDir);
    } catch (error) {
      cb(new Error(`Uploads directory is not writable: ${error.message}`), false);
    }
  },
  filename: function(req, file, cb) {
    // Create a safe filename with timestamp to avoid collisions
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniquePrefix + '-' + safeFilename);
  }
});

// File filter to only accept images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.originalname}. Only JPEG, PNG and PDF are allowed.`), false);
  }
};

// Enhanced error handling for multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).array('files', 10);

// Wrap multer middleware with error handling
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown upload error:', err);
      return res.status(500).json({
        success: false,
        message: `Upload failed: ${err.message}`
      });
    }
    
    // If no files were uploaded (but should have been)
    if (req.body.hasFiles === 'true' && (!req.files || req.files.length === 0)) {
      console.warn('Expected files but none were uploaded');
    }
    
    next();
  });
};

// Routes with enhanced error handling
router.post('/papers', uploadMiddleware, paperController.createPaper);
router.get('/papers', paperController.getAllPapers);
router.get('/papers/:id', paperController.getPaperById);
router.get('/papers/:id/pdf', paperController.generatePDF);
router.put('/papers/:id', uploadMiddleware, paperController.updatePaper);

// Add debugging endpoints
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uploadsDir: uploadsDir,
    dirExists: fs.existsSync(uploadsDir),
    dirWritable: (() => {
      try {
        fs.accessSync(uploadsDir, fs.constants.W_OK);
        return true;
      } catch (e) {
        return false;
      }
    })()
  });
});

// Test database connection
router.get('/debug/db', async (req, res) => {
  try {
    const { pool, testConnection } = require('../config/db');
    const isConnected = await testConnection();
    
    if (isConnected) {
      // Test a simple query
      const [result] = await pool.query('SELECT 1 as test');
      
      res.json({
        status: 'ok',
        connected: true,
        query_result: result,
        db_config: {
          using_url: !!process.env.DATABASE_URL,
          db_name: process.env.DB_NAME || 'Using DATABASE_URL'
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        connected: false,
        message: 'Database connection test failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test file system
router.get('/debug/fs', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, '../uploads');
  
  try {
    // Check if uploads directory exists
    const dirExists = fs.existsSync(uploadsDir);
    
    // Check if directory is writable
    let isWritable = false;
    try {
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      isWritable = true;
    } catch (e) {
      // Not writable
    }
    
    // Try to write a test file
    let canWrite = false;
    const testFilePath = path.join(uploadsDir, `test-${Date.now()}.txt`);
    try {
      fs.writeFileSync(testFilePath, 'Test file');
      canWrite = true;
      // Clean up test file
      fs.unlinkSync(testFilePath);
    } catch (e) {
      // Could not write
    }
    
    res.json({
      status: 'ok',
      uploadsDir,
      dirExists,
      isWritable,
      canWrite,
      environment: {
        node_env: process.env.NODE_ENV,
        cwd: process.cwd(),
        tmpdir: require('os').tmpdir()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
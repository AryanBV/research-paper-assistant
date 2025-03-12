// server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

// Check if we have a DATABASE_URL (Railway provides this)
if (process.env.DATABASE_URL) {
  // Use the connection string directly
  pool = mysql.createPool(process.env.DATABASE_URL);
  console.log('Using DATABASE_URL for connection');
} else {
  // Use individual parameters for local development
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'research_paper_assistant',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('Using individual DB parameters for connection');
}

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

module.exports = { pool, testConnection };
// server/utils/db-init.js
const { pool } = require('../config/db');

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create papers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS papers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        abstract TEXT,
        keywords VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create sections table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paper_id INT NOT NULL,
        section_type ENUM('introduction', 'methodology', 'results', 'discussion', 'conclusion') NOT NULL,
        content TEXT,
        order_num INT NOT NULL,
        FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
      )
    `);
    
    // Create references table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`references\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paper_id INT NOT NULL,
        author VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        publication VARCHAR(255),
        year INT,
        url VARCHAR(255),
        FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
      )
    `);
    
    // Create images table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paper_id INT NOT NULL,
        section_id INT,
        file_path VARCHAR(255) NOT NULL,
        caption TEXT,
        FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
      )
    `);
    
    // Create authors table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paper_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        university VARCHAR(255),
        city VARCHAR(255),
        country VARCHAR(255),
        email VARCHAR(255),
        is_corresponding BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database tables created successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Call the function to initialize the database
initializeDatabase();

module.exports = { initializeDatabase };
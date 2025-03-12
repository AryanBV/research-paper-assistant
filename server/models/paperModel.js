// server/models/paperModel.js
const { pool } = require('../config/db');

// Get a paper by ID with all associated data
exports.getPaperWithDetails = async (paperId) => {
  // Get paper details
  const [papers] = await pool.query('SELECT * FROM papers WHERE id = ?', [paperId]);
  
  if (papers.length === 0) {
    return null;
  }
  
  const paper = papers[0];
  
  // Get sections
  const [sections] = await pool.query(
    'SELECT * FROM sections WHERE paper_id = ? ORDER BY order_num',
    [paperId]
  );
  
  // Get references
  const [references] = await pool.query(
    'SELECT * FROM references WHERE paper_id = ?',
    [paperId]
  );
  
  // Get images
  const [images] = await pool.query(
    'SELECT * FROM images WHERE paper_id = ?',
    [paperId]
  );
  
  return {
    ...paper,
    sections,
    references,
    images
  };
};

// Update image caption
exports.updateImageCaption = async (imageId, caption) => {
  const [result] = await pool.query(
    'UPDATE images SET caption = ? WHERE id = ?',
    [caption, imageId]
  );
  
  return result.affectedRows > 0;
};

// Insert a paper with all its components
exports.createPaper = async (paperData, connection) => {
  const { title, abstract, keywords, sections, references, images } = paperData;
  
  // Insert paper
  const [paper] = await connection.query(
    'INSERT INTO papers (title, abstract, keywords) VALUES (?, ?, ?)',
    [title, abstract, keywords]
  );
  
  const paperId = paper.insertId;
  
  // Insert sections
  if (sections && Array.isArray(sections)) {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await connection.query(
        'INSERT INTO sections (paper_id, section_type, content, order_num) VALUES (?, ?, ?, ?)',
        [paperId, section.type, section.content, i + 1]
      );
    }
  }
  
  // Insert references
  if (references && Array.isArray(references)) {
    for (const reference of references) {
      await connection.query(
        'INSERT INTO references (paper_id, author, title, publication, year, url) VALUES (?, ?, ?, ?, ?, ?)',
        [paperId, reference.author, reference.title, reference.publication, reference.year, reference.url]
      );
    }
  }
  
  // Insert images
  if (images && Array.isArray(images)) {
    for (const image of images) {
      await connection.query(
        'INSERT INTO images (paper_id, file_path, caption) VALUES (?, ?, ?)',
        [paperId, image.path, image.caption]
      );
    }
  }
  
  return paperId;
};
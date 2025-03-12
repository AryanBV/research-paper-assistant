// server/controllers/paperController.js
const { pool } = require('../config/db');
const { generatePaperPDF } = require('../utils/pdfGenerator');
const paperModel = require('../models/paperModel');
const aiService = require('../services/aiService');

// Create a new paper
exports.createPaper = async (req, res) => {
  try {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get form data
      const { title, abstract, keywords, sections, references, authors, generateAI } = req.body;
      
      // Parse sections, references, and authors if they're strings
      let parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
      let parsedReferences = typeof references === 'string' ? JSON.parse(references) : references;
      let parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
      const useAI = generateAI === 'true' || generateAI === true;
      
      // If AI generation is requested, generate content for empty sections
      if (useAI) {
        const paperDetails = { title, abstract, keywords };
        
        parsedSections = parsedSections.map(section => {
          // Only generate content if the section is empty
          if (!section.content || section.content.trim() === '') {
            section.content = aiService.generateSectionContent(section.type, paperDetails);
          }
          return section;
        });
      }
      
      // Insert paper
      const [paper] = await connection.query(
        'INSERT INTO papers (title, abstract, keywords) VALUES (?, ?, ?)',
        [title, abstract, keywords]
      );
      
      const paperId = paper.insertId;
      
      // Insert authors
      if (parsedAuthors && Array.isArray(parsedAuthors)) {
        for (const author of parsedAuthors) {
          await connection.query(
            'INSERT INTO authors (paper_id, name, department, university, city, country, email, is_corresponding) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              paperId, 
              author.name,
              author.department,
              author.university,
              author.city,
              author.country,
              author.email,
              author.is_corresponding ? 1 : 0
            ]
          );
        }
      }
      
      // Insert sections
      if (parsedSections && Array.isArray(parsedSections)) {
        for (let i = 0; i < parsedSections.length; i++) {
          const section = parsedSections[i];
          await connection.query(
            'INSERT INTO sections (paper_id, section_type, content, order_num) VALUES (?, ?, ?, ?)',
            [paperId, section.type, section.content, i + 1]
          );
        }
      }
      
      // Insert references
      if (parsedReferences && Array.isArray(parsedReferences)) {
        for (const reference of parsedReferences) {
            await connection.query(
                'INSERT INTO `references` (paper_id, author, title, publication, year, url) VALUES (?, ?, ?, ?, ?, ?)',
                [paperId, reference.author, reference.title, reference.publication, reference.year, reference.url]
            );
        }
      }
      
      // Process uploaded files with AI-generated captions
      if (req.files && req.files.length > 0) {
        const paperDetails = { title, abstract, keywords };
        
        for (const file of req.files) {
          // Generate AI caption for the image
          const caption = aiService.generateImageCaption(file.originalname, paperDetails);
          
          await connection.query(
            'INSERT INTO images (paper_id, file_path, caption) VALUES (?, ?, ?)',
            [paperId, file.path.replace(/\\/g, '/'), caption]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        success: true,
        message: 'Paper created successfully',
        paperId
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create paper',
      error: error.message
    });
  }
};

exports.updatePaper = async (req, res) => {
  try {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const paperId = req.params.id;
      
      // Get form data
      const { title, abstract, keywords, sections, references, authors, generateAI } = req.body;
      
      // Parse sections, references, and authors if they're strings
      let parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
      let parsedReferences = typeof references === 'string' ? JSON.parse(references) : references;
      let parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
      const useAI = generateAI === 'true' || generateAI === true;
      
      // If AI generation is requested, generate content for empty sections
      if (useAI) {
        const paperDetails = { title, abstract, keywords };
        
        parsedSections = parsedSections.map(section => {
          // Only generate content if the section is empty
          if (!section.content || section.content.trim() === '') {
            section.content = aiService.generateSectionContent(section.type, paperDetails);
          }
          return section;
        });
      }
      
      // Update paper
      await connection.query(
        'UPDATE papers SET title = ?, abstract = ?, keywords = ? WHERE id = ?',
        [title, abstract, keywords, paperId]
      );
      
      // Delete existing sections, references, and authors (we'll re-insert them)
      await connection.query('DELETE FROM sections WHERE paper_id = ?', [paperId]);
      await connection.query('DELETE FROM `references` WHERE paper_id = ?', [paperId]);
      await connection.query('DELETE FROM authors WHERE paper_id = ?', [paperId]);
      
      // Insert updated authors
      if (parsedAuthors && Array.isArray(parsedAuthors)) {
        for (const author of parsedAuthors) {
          await connection.query(
            'INSERT INTO authors (paper_id, name, department, university, city, country, email, is_corresponding) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              paperId, 
              author.name,
              author.department,
              author.university,
              author.city,
              author.country,
              author.email,
              author.is_corresponding ? 1 : 0
            ]
          );
        }
      }
      
      // Insert updated sections
      if (parsedSections && Array.isArray(parsedSections)) {
        for (let i = 0; i < parsedSections.length; i++) {
          const section = parsedSections[i];
          await connection.query(
            'INSERT INTO sections (paper_id, section_type, content, order_num) VALUES (?, ?, ?, ?)',
            [paperId, section.type, section.content, i + 1]
          );
        }
      }
      
      // Insert updated references
      if (parsedReferences && Array.isArray(parsedReferences)) {
        for (const reference of parsedReferences) {
          await connection.query(
            'INSERT INTO `references` (paper_id, author, title, publication, year, url) VALUES (?, ?, ?, ?, ?, ?)',
            [paperId, reference.author, reference.title, reference.publication, reference.year, reference.url]
          );
        }
      }
      
      // Process any new uploaded files
      if (req.files && req.files.length > 0) {
        const paperDetails = { title, abstract, keywords };
        
        for (const file of req.files) {
          // Generate AI caption for the image
          const caption = aiService.generateImageCaption(file.originalname, paperDetails);
          
          await connection.query(
            'INSERT INTO images (paper_id, file_path, caption) VALUES (?, ?, ?)',
            [paperId, file.path.replace(/\\/g, '/'), caption]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      res.status(200).json({
        success: true,
        message: 'Paper updated successfully',
        paperId
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update paper',
      error: error.message
    });
  }
};

// Get all papers
exports.getAllPapers = async (req, res) => {
  try {
    const [papers] = await pool.query('SELECT * FROM papers ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: papers.length,
      data: papers
    });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch papers',
      error: error.message
    });
  }
};

// Get paper by ID
exports.getPaperById = async (req, res) => {
  try {
    // Get paper details
    const [papers] = await pool.query('SELECT * FROM papers WHERE id = ?', [req.params.id]);
    
    if (papers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }
    
    const paper = papers[0];
    
    // Get sections
    const [sections] = await pool.query(
      'SELECT * FROM sections WHERE paper_id = ? ORDER BY order_num',
      [req.params.id]
    );
    
    // Get references
    const [references] = await pool.query(
      'SELECT * FROM `references` WHERE paper_id = ?',
      [req.params.id]
    );
    
    // Get images
    const [images] = await pool.query(
      'SELECT * FROM images WHERE paper_id = ?',
      [req.params.id]
    );
    
    // Get authors
    const [authors] = await pool.query(
      'SELECT * FROM authors WHERE paper_id = ? ORDER BY is_corresponding DESC',
      [req.params.id]
    );
    
    res.status(200).json({
      success: true,
      data: {
        ...paper,
        sections,
        references,
        images,
        authors
      }
    });
  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paper',
      error: error.message
    });
  }
};

// Generate PDF for a paper
exports.generatePDF = async (req, res) => {
  try {
    const paperId = req.params.id;
    
    // Get complete paper data first
    const [papers] = await pool.query('SELECT * FROM papers WHERE id = ?', [paperId]);
    
    if (papers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }
    
    const paper = papers[0];
    
    // Get sections
    const [sections] = await pool.query(
      'SELECT * FROM sections WHERE paper_id = ? ORDER BY order_num',
      [paperId]
    );
    
    // Get references
    const [references] = await pool.query(
      'SELECT * FROM `references` WHERE paper_id = ?',
      [paperId]
    );
    
    // Get images
    const [images] = await pool.query(
      'SELECT * FROM images WHERE paper_id = ?',
      [paperId]
    );
    
    // Get authors
    const [authors] = await pool.query(
      'SELECT * FROM authors WHERE paper_id = ? ORDER BY is_corresponding DESC',
      [paperId]
    );
    
    // Generate PDF
    const pdfBuffer = await generatePaperPDF({
      ...paper,
      sections,
      references,
      images,
      authors
    });
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="paper-${paperId}.pdf"`);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};
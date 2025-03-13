// server/utils/pdfGenerator.js
const html_to_pdf = require('html-pdf-node');
const path = require('path');
const fs = require('fs');

function resolvePath(filePath) {
  // Try multiple possible paths
  const possibilities = [
    filePath,
    path.resolve(filePath),
    path.join(process.cwd(), filePath),
    path.join(__dirname, '..', filePath.replace(/^uploads\//, '')),
    path.join(__dirname, '..', 'uploads', path.basename(filePath))
  ];
  
  for (const p of possibilities) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

// IEEE paper template with enhanced formatting
function generateIEEETemplate(paper) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${paper.title}</title>
        <style>
            @page {
                size: letter;
                margin: 0.75in 0.625in 0.625in 0.625in;
            }
            body {
                font-family: Times, "Times New Roman", serif;
                font-size: 10pt;
                line-height: 1.15;
                margin: 0;
                padding: 0;
                column-count: 2;
                column-gap: 0.25in;
                text-align: justify;
            }
            .paper-title {
                font-size: 24pt;
                font-weight: bold;
                text-align: center;
                margin-bottom: 0.2in;
                column-span: all;
            }
            .author-block {
                text-align: center;
                margin-bottom: 0.2in;
                column-span: all;
            }
            .author-names {
                font-weight: bold;
                margin-bottom: 0.05in;
            }
            .author-affiliations {
                margin-bottom: 0.05in;
                text-align: left;
            }
            .author-emails {
                font-style: italic;
                margin-bottom: 0.05in;
            }
            .corresponding-note {
                font-size: 9pt;
                margin-bottom: 0.1in;
            }
            .abstract-container {
                column-span: all;
                margin-bottom: 0.2in;
            }
            .abstract-title {
                font-weight: bold;
                text-align: center;
                margin-bottom: 0.1in;
            }
            .abstract {
                font-style: italic;
            }
            .keywords {
                font-style: italic;
                margin-bottom: 0.2in;
                column-span: all;
            }
            h1, h2, h3, h4 {
                font-family: Times, "Times New Roman", serif;
            }
            h1 {
                font-size: 12pt;
                font-weight: bold;
                margin-top: 0.1in;
                margin-bottom: 0.1in;
            }
            h2 {
                font-size: 11pt;
                font-weight: bold;
                margin-top: 0.1in;
                margin-bottom: 0.1in;
            }
            h3 {
                font-size: 10pt;
                font-weight: bold;
                font-style: italic;
                margin-top: 0.1in;
                margin-bottom: 0.1in;
            }
            h4 {
                font-size: 10pt;
                font-weight: bold;
                margin-top: 0.1in;
                margin-bottom: 0.1in;
            }
            .section {
                margin-bottom: 0.1in;
                break-inside: avoid;
            }
            .ref-list {
                column-span: all;
                margin-top: 0.2in;
            }
            .ref-title {
                font-weight: bold;
                text-align: center;
                margin-bottom: 0.1in;
            }
            .ref-item {
                text-indent: -0.25in;
                padding-left: 0.25in;
                margin-bottom: 0.1in;
            }
            .image-container {
                width: 100%;
                text-align: center;
                margin: 0.1in 0;
                break-inside: avoid;
            }
            .image-caption {
                font-style: italic;
                font-size: 9pt;
                margin-top: 0.05in;
                text-align: center;
            }
            .image {
                max-width: 100%;
                max-height: 2.5in;
            }
            p {
                margin: 0.05in 0;
            }
            .citation {
                vertical-align: super;
                font-size: 8pt;
                font-weight: bold;
            }
            /* IEEE specific styles */
            .first-page-footer {
                position: fixed;
                bottom: 0.5in;
                left: 0;
                right: 0;
                font-size: 8pt;
                text-align: center;
                column-span: all;
            }
            .page-break {
                page-break-before: always;
                column-span: all;
            }
            sup {
                font-size: 8pt;
                vertical-align: super;
            }

            .affiliation-row {
                text-align: left;
                margin-bottom: 0.03in;
                text-indent: 0;
                display: flex;
                align-items: flex-start;
            }

            .affiliation-row sup {
                flex: 0 0 auto;
                min-width: 0.2in;
                text-align: left;
            }

            .affiliation-text {
                flex: 1;
                padding-left: 0.05in;
            } 

            .author-affiliations {
                text-align: left;
                margin-top: 0.05in;
                margin-bottom: 0.05in;
            }
        
            .affiliation-line sup {
                display: inline-block;
                min-width: 0.15in;
            }

            .affiliation-line {
                display: flex;
                text-align: left;
                line-height: 1.2;
                margin-bottom: 0.02in;
                align-items: flex-start;
            }
            .affiliation-number {
                width: 0.2in;
                text-align: left;
                flex-shrink: 0;
            }
            .affiliation-content {
                flex-grow: 1;
            }

            .affiliations-container {
                width: 80%;
                margin: 0 auto;
                text-align: left;
            }
            .affiliation-row {
                display: flex;
                margin-bottom: 0.05in;
            }
            .superscript-column {
                width: 20px;
                text-align: right;
                padding-right: 5px;
            }
            .department-column {
                flex: 1;
                text-align: left;
            }

            .author-affiliations-center {
                width: 100%;
                text-align: center;
                margin: 0.1in auto;
            }
            .affiliation-item {
                margin-bottom: 0.02in;
            }
        </style>
    </head>
    <body>
        <div class="paper-title">${paper.title}</div>
        
        <div class="author-block">
            ${generateAuthorsHTML(paper.authors)}
        </div>
        
        <div class="abstract-container">
            <div class="abstract-title">Abstract</div>
            <div class="abstract">
                ${paper.abstract}
            </div>
        </div>
        
        <div class="keywords">
            <strong>Keywords—</strong>${paper.keywords}
        </div>
        
        ${generateSections(paper.sections, paper.images)}
        
        <div class="ref-list">
            <div class="ref-title">REFERENCES</div>
            <ol>
                ${generateReferences(paper.references)}
            </ol>
        </div>
    </body>
    </html>
  `;
}

// Generate HTML for multiple authors horizontally (IEEE format)
function generateAuthorsHTML(authors) {
    if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return 'Author Name, Department Name, University Name<br>City, Country<br>email@example.com';
    }
    
    // Names row - all author names in a single line with numeric superscripts
    const namesRow = authors.map((author, index) => {
      // Always use a number, even for corresponding author
      return `${author.name}<sup>${index + 1}</sup>`;
    }).join(', ');
    
    // Affiliations - centered with proper spacing
    const affiliationsRows = authors.map((author, index) => {
      return `<div class="affiliation-item">
        <sup>${index + 1}</sup>${author.department}, ${author.university}, ${author.city}, ${author.country}
      </div>`;
    }).join('');
    
    // Emails in a single line with numeric superscripts
    const emailsRow = `Email: ${authors.map((author, index) => 
      `<sup>${index + 1}</sup>${author.email}`
    ).join(', ')}`;
    
    // Add corresponding author note with numeric reference
    const correspondingIndex = authors.findIndex(author => author.is_corresponding);
    const correspondingNote = correspondingIndex >= 0 ? 
      `<sup>${correspondingIndex + 1}</sup>Corresponding Author` : "";
    
    return `
      <div class="author-names">${namesRow}</div>
      <div class="author-affiliations-center">${affiliationsRows}</div>
      <div class="author-emails">${emailsRow}</div>
      <div class="corresponding-note">${correspondingNote}</div>
    `;
}

// Generate sections HTML with image integration
function generateSections(sections, images) {
  if (!sections || !Array.isArray(sections)) {
    return '';
  }
  
  let sectionHtml = '';
  let imageIndex = 0;
  
  // Sort images evenly across sections
  const imagesPerSection = images && images.length ? Math.ceil(images.length / sections.length) : 0;
  
  sections.forEach((section, index) => {
    sectionHtml += `
      <div class="section">
        <h1>${getSectionTitle(section.section_type, index)}</h1>
        ${formatSectionContent(section.content)}
    `;
    
    // Add images to sections
    if (images && images.length && imageIndex < images.length) {
      const sectionImages = images.slice(imageIndex, imageIndex + imagesPerSection);
      
      sectionImages.forEach(image => {
        // Create base64 from image file if possible
        // First, make sure the path is correct - it should be relative to the server root
        const serverRoot = path.resolve(__dirname, '..');
        const relativePath = image.file_path.replace(/\\/g, '/');
        const absolutePath = path.join(serverRoot, relativePath);
        
        console.log('Processing image:', {
          relativePath: relativePath,
          absolutePath: absolutePath
        });
        
        let imgSrc = '';
        try {
          const foundPath = resolvePath(relativePath);
          
          if (foundPath) {
            console.log('Image file found at:', foundPath);
            const imageBuffer = fs.readFileSync(foundPath);
            const base64Image = imageBuffer.toString('base64');
            const mimeType = getMimeType(foundPath);
            imgSrc = `data:${mimeType};base64,${base64Image}`;
          } else {
            console.error('Image file not found at any attempted path:', {
              relativePath, absolutePath, serverRoot
            });
            imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVMQEAIAzAMMC/5yFjRxMFfXpnZg5Eve0A2GQA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxA2wGA2QVA7WKhMQAAAABJRU5ErkJggg==';
          }
        } catch (err) {
          console.error('Error reading image:', err);
          imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVMQEAIAzAMMC/5yFjRxMFfXpnZg5Eve0A2GQA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxAmgFIMwBpBiDNAKQZgDQDkGYA0gxA2wGA2QVA7WKhMQAAAABJRU5ErkJggg=='; // Base64 placeholder
        }
        
        sectionHtml += `
          <div class="image-container">
            <img class="image" src="${imgSrc}" alt="${image.caption || 'Figure'}">
            <div class="image-caption">${image.caption || `Fig. ${imageIndex + 1}`}</div>
          </div>
        `;
        imageIndex++;
      });
    }
    
    sectionHtml += `</div>`;
    
    // Add page break between major sections if needed
    if (index === 1) {
      sectionHtml += `<div class="page-break"></div>`;
    }
  });
  
  return sectionHtml;
}

// Format section content
function formatSectionContent(content) {
  if (!content) return '';
  
  // Split into paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  
  return paragraphs.map(p => `<p>${p}</p>`).join('');
}

// Get section title based on type with proper IEEE numbering
function getSectionTitle(type, index) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const numeral = romanNumerals[index] || (index + 1);
  
  const titles = {
    'introduction': 'Introduction',
    'methodology': 'Methodology',
    'results': 'Results',
    'discussion': 'Discussion and Analysis',
    'conclusion': 'Conclusion'
  };
  
  const title = titles[type] || type.charAt(0).toUpperCase() + type.slice(1);
  return `${numeral}. ${title}`;
}

// Generate IEEE format references HTML
function generateReferences(references) {
  if (!references || !Array.isArray(references)) {
    return '';
  }
  
  return references.map((ref, index) => {
    // Format based on reference type (journal, conference, book, etc.)
    let formattedRef = '';
    
    if (ref.publication.toLowerCase().includes('journal')) {
      // Journal article format
      formattedRef = `${ref.author}, "${ref.title}," <em>${ref.publication}</em>, vol. X, no. Y, pp. XX-XX, ${ref.year}.`;
    } else if (ref.publication.toLowerCase().includes('conference')) {
      // Conference paper format
      formattedRef = `${ref.author}, "${ref.title}," in <em>Proc. ${ref.publication}</em>, City, Country, ${ref.year}, pp. XX-XX.`;
    } else if (ref.publication.toLowerCase().includes('book')) {
      // Book format
      formattedRef = `${ref.author}, <em>${ref.title}</em>. City, Country: Publisher, ${ref.year}.`;
    } else {
      // Default format
      formattedRef = `${ref.author}, "${ref.title}," ${ref.publication}, ${ref.year}.`;
    }
    
    // Add URL if available
    if (ref.url) {
      formattedRef += ` [Online]. Available: ${ref.url}`;
    }
    
    return `
      <li class="ref-item">
        ${formattedRef}
      </li>
    `;
  }).join('');
}

// Get MIME type from file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp'
  };
  
  return mimeTypes[ext] || 'image/png';
}

// Generate PDF from paper data
async function generatePaperPDF(paper) {
  const html = generateIEEETemplate(paper);
  
  // Add this to the options in generatePaperPDF
  const options = {
    format: 'Letter',
    margin: {
      top: '0.75in',
      right: '0.625in',
      bottom: '0.625in',
      left: '0.625in'
    },
    printBackground: true,
    displayHeaderFooter: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
  };
  
  const file = { content: html };
  
  try {
    const buffer = await html_to_pdf.generatePdf(file, options);
    return buffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

module.exports = { generatePaperPDF };
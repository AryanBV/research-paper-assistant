// client/src/components/Preview/PaperPreview.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaperById, downloadPaperAsPDF } from '../../services/paperService';

const PaperPreview = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        const response = await getPaperById(id);
        setPaper(response.data);
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);
  
  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await downloadPaperAsPDF(id);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
        <button className="btn btn-link" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }
  
  if (!paper) {
    return (
      <div className="alert alert-warning mt-4" role="alert">
        Paper not found. <Link to="/" className="alert-link">Go back to home</Link>
      </div>
    );
  }
  
  return (
    <div className="paper-preview">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Paper Preview</h2>
        <button
          className="btn btn-primary"
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF...' : 'Download as PDF'}
        </button>
      </div>
      
      <div className="paper-preview-content border p-4">
        <h1 className="text-center mb-4">{paper.title}</h1>
        
        <div className="abstract mb-4">
          <h3>Abstract</h3>
          <p className="fst-italic">{paper.abstract}</p>
        </div>
        
        <div className="keywords mb-4">
          <h3>Keywords</h3>
          <p>{paper.keywords}</p>
        </div>
        
        {paper.sections && paper.sections.map((section, index) => (
          <div className="section mb-4" key={index}>
            <h3>{getSectionTitle(section.section_type, index)}</h3>
            <div className="section-content">
              {formatContent(section.content)}
            </div>
            
            {/* Display images related to this section */}
            {getImagesForSection(paper.images, paper.sections.length, index).map((image, imgIndex) => (
              <div className="text-center my-3" key={imgIndex}>
                <img 
                    src={`/${image.file_path}`} 
                    alt={image.caption || 'Figure'} 
                    className="img-fluid border" 
                    style={{maxHeight: '300px'}}
                />
                <p className="fst-italic mt-1">{image.caption || `Figure ${imgIndex + 1}`}</p>
              </div>
            ))}
          </div>
        ))}
        
        <div className="references mb-4">
          <h3>References</h3>
          <ol>
            {paper.references && paper.references.map((ref, index) => (
              <li key={index}>
                {ref.author}, "{ref.title}," {ref.publication}, {ref.year}.
                {ref.url && <span> [Online]. Available: <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.url}</a></span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getSectionTitle = (type, index) => {
  const titles = {
    'introduction': 'Introduction',
    'methodology': 'Methodology',
    'results': 'Results',
    'discussion': 'Discussion',
    'conclusion': 'Conclusion'
  };
  
  return titles[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

const formatContent = (content) => {
  if (!content) return <p>No content available.</p>;
  
  // Split into paragraphs
  return content.split('\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
};

const getImagesForSection = (images, totalSections, sectionIndex) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }
  
  // Distribute images across sections
  const imagesPerSection = Math.ceil(images.length / totalSections);
  const startIndex = sectionIndex * imagesPerSection;
  const endIndex = startIndex + imagesPerSection;
  
  return images.slice(startIndex, endIndex);
};

export default PaperPreview;
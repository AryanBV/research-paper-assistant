// client/src/pages/ViewPaperPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewPaperPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/papers/${id}`);
        setPaper(response.data.data);
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);
  
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }
  
  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
        <Link to="/" className="d-block mt-3">Back to Home</Link>
      </div>
    );
  }
  
  if (!paper) {
    return (
      <div className="alert alert-warning mt-4" role="alert">
        Paper not found.
        <Link to="/" className="d-block mt-3">Back to Home</Link>
      </div>
    );
  }
  
  const downloadPDF = () => {
    window.open(`http://localhost:5000/api/papers/${id}/pdf`, '_blank');
  };
  
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  
  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Paper Preview</h2>
          <div>
            <button className="btn btn-secondary me-2" onClick={handleEdit}>
              Edit Paper
            </button>
            <button className="btn btn-primary" onClick={downloadPDF}>
              Download IEEE PDF
            </button>
          </div>
        </div>
        <div className="card-body">
          <h1 className="text-center mb-4">{paper.title}</h1>
          
          {paper.authors && paper.authors.length > 0 && (
            <div className="mb-4">
              <h3>Authors</h3>
              <ul className="list-group">
                {paper.authors.map((author, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{author.name}</strong> 
                    {author.is_corresponding && <span className="badge bg-primary ms-2">Corresponding</span>}
                    <br />
                    {author.department}, {author.university}<br />
                    {author.city}, {author.country}<br />
                    {author.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-4">
            <h3>Abstract</h3>
            <p>{paper.abstract}</p>
          </div>
          
          <div className="mb-4">
            <h3>Keywords</h3>
            <p>{paper.keywords}</p>
          </div>
          
          {paper.sections && paper.sections.map((section, index) => (
            <div key={index} className="mb-4">
              <h3>{section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1)}</h3>
              <p>{section.content}</p>
            </div>
          ))}
          
          {paper.references && paper.references.length > 0 && (
            <div className="mb-4">
              <h3>References</h3>
              <ol>
                {paper.references.map((ref, index) => (
                  <li key={index}>
                    {ref.author}, "{ref.title}", {ref.publication}, {ref.year}.
                    {ref.url && <span> [Online]. Available: {ref.url}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {paper.images && paper.images.length > 0 && (
            <div className="mb-4">
              <h3>Uploaded Files</h3>
              <div className="row">
                {paper.images.map((image, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{image.caption || `File ${index + 1}`}</h5>
                        <a href={`http://localhost:5000/${image.file_path}`} target="_blank" rel="noreferrer">
                          View File
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 mb-5">
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>
    </div>
  );
};

export default ViewPaperPage;
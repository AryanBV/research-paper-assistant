// client/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/papers');
        setPapers(response.data.data);
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPapers();
  }, []);
  
  return (
    <div className="container">
      <div className="text-center my-5">
        <h1>Research Paper Assistant</h1>
        <p className="lead">
          Generate IEEE-formatted research papers with AI assistance
        </p>
        <Link to="/create" className="btn btn-primary btn-lg mt-3">
          Create New Paper
        </Link>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Your Papers</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border"></div>
                </div>
              ) : papers.length > 0 ? (
                <div className="list-group">
                  {papers.map(paper => (
                    <Link 
                      key={paper.id}
                      to={`/view/${paper.id}`} 
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{paper.title}</h5>
                        <small>{new Date(paper.created_at).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">
                        {paper.abstract.length > 150 
                          ? paper.abstract.substring(0, 150) + '...' 
                          : paper.abstract}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p>You haven't created any papers yet.</p>
                  <Link to="/create" className="btn btn-primary">
                    Create Your First Paper
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
// client/src/pages/EditPaperPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPaperById } from '../services/paperService';
import PaperDetailsForm from '../components/PaperForm/PaperDetailsForm';
import axios from 'axios';

const EditPaperPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await getPaperById(id);
        setPaper(response.data);
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      // Update the paper using axios directly (or add to paperService)
      const response = await axios.put(`http://localhost:5000/api/papers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate(`/view/${id}`);
    } catch (error) {
      console.error('Error updating paper:', error);
      setError('Failed to update paper. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
        <div className="mt-3">
          <Link to={`/view/${id}`} className="btn btn-secondary">Back to Paper</Link>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="alert alert-warning mt-4" role="alert">
        Paper not found.
        <div className="mt-3">
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Edit Research Paper</h1>
      <PaperDetailsForm 
        initialPaperData={paper} 
        onSubmit={handleSubmit} 
        isEditing={true}
      />
    </div>
  );
};

export default EditPaperPage;
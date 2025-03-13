// client/src/services/paperService.js
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path
  : 'http://localhost:5000/api'; // In development, use localhost

// Create a new paper with form data
export const createPaper = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/papers`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all papers
export const getAllPapers = async () => {
  try {
    const response = await axios.get(`${API_URL}/papers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get paper by ID
export const getPaperById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/papers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaper = async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/papers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
};

// Download paper as PDF
export const downloadPaperAsPDF = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/papers/${id}/pdf`, {
      responseType: 'blob'
    });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `paper-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error;
  }
};
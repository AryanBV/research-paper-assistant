// client/src/components/PaperForm/PaperDetailsForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../FileUpload/FileUploader';
import SectionInput from './SectionInput';
import ReferencesInput from './ReferencesInput';
import { createPaper } from '../../services/paperService';

const PaperDetailsForm = ({ initialPaperData = null, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  
  const defaultData = {
    title: '',
    abstract: '',
    keywords: '',
    authors: [
      { 
        name: '', 
        department: '', 
        university: '', 
        city: '', 
        country: '', 
        email: '',
        is_corresponding: true 
      }
    ],
    sections: [
      { type: 'introduction', content: '' },
      { type: 'methodology', content: '' },
      { type: 'results', content: '' },
      { type: 'discussion', content: '' },
      { type: 'conclusion', content: '' }
    ],
    references: []
  };
  
  const [paperData, setPaperData] = useState(defaultData);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiSections, setAiSections] = useState({
    introduction: true,
    methodology: true,
    results: true,
    discussion: true,
    conclusion: true
  });
  
  // Initialize form with existing data when editing
  useEffect(() => {
    if (isEditing && initialPaperData) {
      // Format sections from database to match form structure
      const formattedSections = [];
      const sectionTypes = ['introduction', 'methodology', 'results', 'discussion', 'conclusion'];
      
      // Ensure all section types exist in the correct order
      sectionTypes.forEach(type => {
        const existingSection = initialPaperData.sections?.find(s => s.section_type === type);
        if (existingSection) {
          formattedSections.push({
            type: existingSection.section_type,
            content: existingSection.content
          });
        } else {
          formattedSections.push({ type, content: '' });
        }
      });

      // Format authors
      const formattedAuthors = initialPaperData.authors?.length > 0 
        ? initialPaperData.authors.map(author => ({
            name: author.name || '',
            department: author.department || '',
            university: author.university || '',
            city: author.city || '',
            country: author.country || '',
            email: author.email || '',
            is_corresponding: author.is_corresponding ? true : false
          }))
        : defaultData.authors;

      // Format references
      const formattedReferences = initialPaperData.references?.map(ref => ({
        author: ref.author || '',
        title: ref.title || '',
        publication: ref.publication || '',
        year: ref.year || '',
        url: ref.url || ''
      })) || [];

      setPaperData({
        title: initialPaperData.title || '',
        abstract: initialPaperData.abstract || '',
        keywords: initialPaperData.keywords || '',
        authors: formattedAuthors,
        sections: formattedSections,
        references: formattedReferences
      });
    }
  }, [initialPaperData, isEditing]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaperData({
      ...paperData,
      [name]: value
    });
  };
  
  const handleSectionChange = (index, content) => {
    const updatedSections = [...paperData.sections];
    updatedSections[index].content = content;
    setPaperData({
      ...paperData,
      sections: updatedSections
    });
  };
  
  const handleReferencesChange = (references) => {
    setPaperData({
      ...paperData,
      references
    });
  };
  
  const handleFileChange = (selectedFiles) => {
    setFiles(selectedFiles);
  };
  
  const handleAIToggle = (e) => {
    setUseAI(e.target.checked);
  };
  
  const handleAISectionToggle = (sectionType) => {
    setAiSections({
      ...aiSections,
      [sectionType]: !aiSections[sectionType]
    });
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...paperData.authors];
    updatedAuthors[index][field] = value;
    setPaperData({
      ...paperData,
      authors: updatedAuthors
    });
  };
  
  const handleCorrespondingAuthor = (index) => {
    const updatedAuthors = [...paperData.authors].map((author, i) => ({
      ...author,
      is_corresponding: i === index
    }));
    setPaperData({
      ...paperData,
      authors: updatedAuthors
    });
  };
  
  const addAuthor = () => {
    setPaperData({
      ...paperData,
      authors: [
        ...paperData.authors,
        { name: '', department: '', university: '', city: '', country: '', email: '', is_corresponding: false }
      ]
    });
  };
  
  const removeAuthor = (index) => {
    const updatedAuthors = [...paperData.authors];
    updatedAuthors.splice(index, 1);
    
    // Ensure at least one author is marked as corresponding
    if (!updatedAuthors.some(author => author.is_corresponding)) {
      updatedAuthors[0].is_corresponding = true;
    }
    
    setPaperData({
      ...paperData,
      authors: updatedAuthors
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add paper details
      formData.append('title', paperData.title);
      formData.append('abstract', paperData.abstract);
      formData.append('keywords', paperData.keywords);
      formData.append('authors', JSON.stringify(paperData.authors));
      
      // If AI is enabled, only include sections that should be AI-generated
      if (useAI) {
        const sectionsWithAIFlag = paperData.sections.map(section => ({
          ...section,
          useAI: aiSections[section.type]
        }));
        formData.append('sections', JSON.stringify(sectionsWithAIFlag));
        formData.append('generateAI', 'true');
      } else {
        formData.append('sections', JSON.stringify(paperData.sections));
        formData.append('generateAI', 'false');
      }
      
      // Add references as JSON
      formData.append('references', JSON.stringify(paperData.references));
      
      // Add files
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      // Use the onSubmit callback if provided, otherwise use createPaper
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior for backward compatibility
        const response = await createPaper(formData);
        navigate(`/view/${response.paperId}`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'submitting'} paper:`, err);
      
      // Enhanced error extraction from axios response
      let errorMessage = `Failed to ${isEditing ? 'update' : 'submit'} paper`;
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', err.response);
        errorMessage = err.response.data?.message || 
                     `Server error: ${err.response.status} - ${err.response.statusText}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        errorMessage = `Request error: ${err.message}`;
      }
      
      setError(`${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="paper-form">
      <h2 className="mb-4">{isEditing ? 'Edit IEEE Research Paper' : 'Create IEEE Research Paper'}</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Paper Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={paperData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="abstract" className="form-label">Abstract</label>
          <textarea
            className="form-control"
            id="abstract"
            name="abstract"
            rows="4"
            value={paperData.abstract}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
            <label className="form-label">Authors</label>
            <div className="authors-list">
                {paperData.authors.map((author, index) => (
                <div key={index} className="author-entry mb-3 p-3 border rounded">
                    <div className="row">
                    <div className="col-md-6 mb-2">
                        <label htmlFor={`author-name-${index}`} className="form-label">Name</label>
                        <input
                        type="text"
                        className="form-control"
                        id={`author-name-${index}`}
                        value={author.name}
                        onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                        required
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label htmlFor={`author-department-${index}`} className="form-label">Department</label>
                        <input
                        type="text"
                        className="form-control"
                        id={`author-department-${index}`}
                        value={author.department}
                        onChange={(e) => handleAuthorChange(index, 'department', e.target.value)}
                        />
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-md-6 mb-2">
                        <label htmlFor={`author-university-${index}`} className="form-label">University/Organization</label>
                        <input
                        type="text"
                        className="form-control"
                        id={`author-university-${index}`}
                        value={author.university}
                        onChange={(e) => handleAuthorChange(index, 'university', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label htmlFor={`author-email-${index}`} className="form-label">Email</label>
                        <input
                        type="email"
                        className="form-control"
                        id={`author-email-${index}`}
                        value={author.email}
                        onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                        />
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-md-6 mb-2">
                        <label htmlFor={`author-city-${index}`} className="form-label">City</label>
                        <input
                        type="text"
                        className="form-control"
                        id={`author-city-${index}`}
                        value={author.city}
                        onChange={(e) => handleAuthorChange(index, 'city', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label htmlFor={`author-country-${index}`} className="form-label">Country</label>
                        <input
                        type="text"
                        className="form-control"
                        id={`author-country-${index}`}
                        value={author.country}
                        onChange={(e) => handleAuthorChange(index, 'country', e.target.value)}
                        />
                    </div>
                    </div>
                    <div className="mb-2 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`author-corresponding-${index}`}
                        checked={author.is_corresponding}
                        onChange={(e) => handleCorrespondingAuthor(index)}
                    />
                    <label className="form-check-label" htmlFor={`author-corresponding-${index}`}>
                        Corresponding Author
                    </label>
                    </div>
                    {paperData.authors.length > 1 && (
                    <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => removeAuthor(index)}
                    >
                        Remove Author
                    </button>
                    )}
                </div>
                ))}
                <button 
                type="button" 
                className="btn btn-sm btn-secondary" 
                onClick={addAuthor}
                >
                Add Another Author
                </button>
            </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="keywords" className="form-label">Keywords (comma separated)</label>
          <input
            type="text"
            className="form-control"
            id="keywords"
            name="keywords"
            value={paperData.keywords}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="useAI"
            checked={useAI}
            onChange={handleAIToggle}
          />
          <label className="form-check-label" htmlFor="useAI">
            Use AI to generate content for empty sections
          </label>
        </div>
        
        <h3 className="mt-4">Paper Sections</h3>
        {paperData.sections.map((section, index) => (
          <div key={index} className="section-container">
            <SectionInput
              sectionType={section.type}
              content={section.content}
              onChange={(content) => handleSectionChange(index, content)}
            />
            {useAI && (
              <div className="mt-1 mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`ai-${section.type}`}
                  checked={aiSections[section.type]}
                  onChange={() => handleAISectionToggle(section.type)}
                />
                <label className="form-check-label" htmlFor={`ai-${section.type}`}>
                  Generate {section.type} with AI
                </label>
              </div>
            )}
          </div>
        ))}
        
        <h3 className="mt-4">References</h3>
        <ReferencesInput
          references={paperData.references}
          onChange={handleReferencesChange}
        />
        
        <h3 className="mt-4">Upload Images & Graphs</h3>
        <p className="text-muted">Images will be automatically captioned by AI based on your paper content.</p>
        <FileUploader onChange={handleFileChange} />
        
        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : isEditing ? 'Update IEEE Paper' : 'Generate IEEE Paper'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaperDetailsForm;
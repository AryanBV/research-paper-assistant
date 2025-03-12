// client/src/components/PaperForm/ReferencesInput.js
import React, { useState } from 'react';

const ReferencesInput = ({ references, onChange }) => {
  const [newReference, setNewReference] = useState({
    author: '',
    title: '',
    publication: '',
    year: '',
    url: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReference({
      ...newReference,
      [name]: value
    });
  };
  
  const addReference = () => {
    if (!newReference.title || !newReference.author) {
      return; // Don't add empty references
    }
    
    const updatedReferences = [...references, { ...newReference }];
    onChange(updatedReferences);
    
    // Reset form
    setNewReference({
      author: '',
      title: '',
      publication: '',
      year: '',
      url: ''
    });
  };
  
  const removeReference = (index) => {
    const updatedReferences = [...references];
    updatedReferences.splice(index, 1);
    onChange(updatedReferences);
  };
  
  return (
    <div className="references-input">
      <div className="row">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Author(s)"
            name="author"
            value={newReference.author}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            name="title"
            value={newReference.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Publication"
            name="publication"
            value={newReference.publication}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Year"
            name="year"
            value={newReference.year}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="URL (optional)"
            name="url"
            value={newReference.url}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-2">
          <button
            type="button"
            className="btn btn-success w-100"
            onClick={addReference}
          >
            Add
          </button>
        </div>
      </div>
      
      {references.length > 0 && (
        <div className="mt-3">
          <h5>Added References:</h5>
          <ul className="list-group">
            {references.map((ref, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {ref.author}, "{ref.title}", {ref.publication}, {ref.year}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeReference(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReferencesInput;
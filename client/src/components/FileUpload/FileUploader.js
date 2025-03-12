// client/src/components/FileUpload/FileUploader.js
import React, { useState } from 'react';

const FileUploader = ({ onChange }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    onChange(files);
  };
  
  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles);
  };
  
  return (
    <div className="file-uploader">
      <div className="mb-3">
        <label htmlFor="fileUpload" className="form-label">
          Upload Images, Graphs & References (PNG, JPEG, PDF)
        </label>
        <input
          type="file"
          className="form-control"
          id="fileUpload"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileChange}
        />
        <div className="form-text">
          Upload images and graphs to be included in your paper.
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <h5>Selected Files:</h5>
          <ul className="list-group">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFile(index)}
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

export default FileUploader;
// client/src/components/PaperForm/SectionInput.js
import React from 'react';

const SectionInput = ({ sectionType, content, onChange }) => {
  const sectionTitles = {
    'introduction': 'Introduction',
    'methodology': 'Methodology',
    'results': 'Results',
    'discussion': 'Discussion',
    'conclusion': 'Conclusion'
  };
  
  const title = sectionTitles[sectionType] || sectionType;
  
  return (
    <div className="mb-3">
      <label htmlFor={`section-${sectionType}`} className="form-label">
        {title}
      </label>
      <textarea
        className="form-control"
        id={`section-${sectionType}`}
        rows="5"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${title} content here...`}
      ></textarea>
    </div>
  );
};

export default SectionInput;
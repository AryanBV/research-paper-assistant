// client/src/pages/CreatePaperPage.js
import React from 'react';
import PaperDetailsForm from '../components/PaperForm/PaperDetailsForm';

const CreatePaperPage = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <PaperDetailsForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePaperPage;
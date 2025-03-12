// client/src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <div className="container text-center">
        <p className="mb-0">
          Research Paper Assistant &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
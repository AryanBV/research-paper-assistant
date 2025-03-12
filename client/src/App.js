// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import CreatePaperPage from './pages/CreatePaperPage';
import ViewPaperPage from './pages/ViewPaperPage';
import EditPaperPage from './pages/EditPaperPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePaperPage />} />
            <Route path="/view/:id" element={<ViewPaperPage />} />
            <Route path="/edit/:id" element={<EditPaperPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
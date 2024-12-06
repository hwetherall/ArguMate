import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ClaimsPage from './pages/ClaimsPage';
import SummaryPage from './pages/SummaryPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<LandingPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

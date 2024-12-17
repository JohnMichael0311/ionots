import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import AssignmentTracker from './components/AssignmentTracker';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/assignments" element={<AssignmentTracker />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
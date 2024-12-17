import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            Ionots Learning Platform
          </div>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-200">Projects</Link>
            <Link to="/assignments" className="hover:text-blue-200">My Assignments</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

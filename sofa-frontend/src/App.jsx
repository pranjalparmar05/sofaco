import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import contact from './components/contact';


function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. About Us Section */}
      <About />

      {/* 4. Contact Us Section */}
      <Contact />

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-200 py-6 text-center text-sm border-t border-amber-900">
        <p>&copy; {new Date().getFullYear()} SofaCraft. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
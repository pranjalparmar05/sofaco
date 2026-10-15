import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem('username'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-amber-800 tracking-wide">
                SofaCraft🛋️
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8 font-medium text-gray-700">
              <a href="#home" className="hover:text-amber-700 transition duration-200">Home</a>
              <a href="#products" className="hover:text-amber-700 transition duration-200">Collection</a>
              <a href="#about" className="hover:text-amber-700 transition duration-200">About Us</a>
              <a href="#contact" className="hover:text-amber-700 transition duration-200">Contact Us</a>
            </div>

            {/* Cart & Auth */}
            <div className="flex items-center space-x-4 relative z-50">
              <button 
                type="button"
                className="relative p-2 text-gray-700 hover:text-amber-700 transition duration-200 cursor-pointer"
              >
                🛒
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-amber-900 font-semibold">Hi, {user}</span>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAuthOpen(true);
                  }}
                  className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition duration-200 font-medium shadow-md cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(username) => setUser(username)} 
      />
    </>
  );
}
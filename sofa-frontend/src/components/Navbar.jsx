import React, { useState } from 'react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const user = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="cursor-pointer">
              <span className="text-2xl font-bold text-amber-800">
                SofaCraft🛋️
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex space-x-8 font-medium text-gray-700">
              <a href="#home" className="hover:text-amber-700 py-2">Home</a>
              <a href="#products" className="hover:text-amber-700 py-2">Collection</a>
              <a href="#about" className="hover:text-amber-700 py-2">About Us</a>
              <a href="#contact" className="hover:text-amber-700 py-2">Contact Us</a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                type="button"
                onClick={() => alert("Cart clicked!")}
                className="p-2 text-gray-700 hover:text-amber-700 cursor-pointer"
              >
                🛒
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-amber-900 font-semibold">Hi, {user}</span>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </>
  );
}
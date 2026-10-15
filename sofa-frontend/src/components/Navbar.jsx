import React, { useState } from 'react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('username'));

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <span className="text-2xl font-bold text-amber-800 tracking-wide cursor-pointer">
                SofaCraft🛋️
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex space-x-8 font-medium text-gray-700">
              <a href="#home" className="hover:text-amber-700 transition duration-200">Home</a>
              <a href="#products" className="hover:text-amber-700 transition duration-200">Sofa Collection</a>
              <a href="#about" className="hover:text-amber-700 transition duration-200">About Us</a>
              <a href="#contact" className="hover:text-amber-700 transition duration-200">Contact</a>
            </div>

            {/* Cart & Login */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-700 hover:text-amber-700 transition duration-200">
                🛒
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </button>

              {user ? (
                <span className="text-amber-900 font-semibold">Hi, {user}</span>
              ) : (
                <button 
                  onClick={() => {
                    console.log("Login button clicked!"); // Console me check karne ke liye
                    setIsAuthOpen(true);
                  }}
                  className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition duration-200 font-medium shadow-sm cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal Component */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(username) => setUser(username)} 
      />
    </>
  );
}
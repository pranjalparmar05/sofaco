import React, { useState } from 'react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Apna Render backend URL yahan dalein
  const API_BASE_URL = "https://sofa-backend-xxxx.onrender.com"; 

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/register/`, formData);
      setMessage(response.data.message);
      setStep(2); 
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/verify-otp/`, {
        email: formData.email,
        otp: otp
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', response.data.username);

      alert("Login successful!");
      onLoginSuccess(response.data.username);
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
          {step === 1 ? (isRegistering ? "Create Account" : "Welcome Back") : "Verify Email OTP"}
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg text-center border border-amber-200">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                  placeholder="Enter username"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                placeholder="Enter password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-800 text-white py-2.5 rounded-lg hover:bg-amber-900 transition font-medium shadow-md cursor-pointer"
            >
              {loading ? "Please wait..." : (isRegistering ? "Register & Send OTP" : "Continue")}
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="text-amber-700 font-semibold hover:underline cursor-pointer"
              >
                {isRegistering ? "Login" : "Register"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              We have sent a 6-digit OTP to your backend console. Please enter it below.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter 6-digit OTP</label>
              <input 
                type="text" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                className="mt-1 w-full px-4 py-2 text-center text-2xl tracking-widest border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                placeholder="------"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-800 text-white py-2.5 rounded-lg hover:bg-amber-900 transition font-medium shadow-md cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
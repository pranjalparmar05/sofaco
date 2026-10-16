import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  // Sofas state jo backend se aayegi
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend se sofas fetch karna
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sofas/') // Live hone par yahan Render ka URL aa jayega
      .then((res) => res.json())
      .then((data) => {
        setSofas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sofas:", err);
        setLoading(false);
      });
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const usernameToSet = isLoginTab ? (emailInput.split('@')[0] || 'User') : (nameInput || 'User');
    localStorage.setItem('username', usernameToSet);
    setUser(usernameToSet);
    setIsAuthOpen(false);
    setEmailInput('');
    setPassInput('');
    setNameInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUser('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative scroll-smooth">
      
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="cursor-pointer">
              <span className="text-2xl font-bold text-amber-800">SofaCraft🛋️</span>
            </div>

            <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
              <a href="#home" className="hover:text-amber-700 transition">Home</a>
              <a href="#products" className="hover:text-amber-700 transition">Collection</a>
              <a href="#about" className="hover:text-amber-700 transition">About Us</a>
              <a href="#contact" className="hover:text-amber-700 transition">Contact Us</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button type="button" onClick={() => alert("Cart is empty!")} className="p-2 text-gray-700 hover:text-amber-700 cursor-pointer relative">
                🛒
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-amber-900 font-semibold">Hi, {user}</span>
                  <button type="button" onClick={handleLogout} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition cursor-pointer">
                    Logout
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsAuthOpen(true)} className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition font-medium shadow-md cursor-pointer">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-amber-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">Crafting Comfort for Your Home</h1>
          <p className="text-lg sm:text-xl text-amber-100 mb-8">Discover handcrafted, luxury sofas designed to bring elegance to your living space.</p>
          <a href="#products" className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition inline-block cursor-pointer">
            Explore Collection
          </a>
        </div>
      </section>

      {/* Product Collection from Backend */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Exclusive Sofa Collection</h2>
        
        {loading ? (
          <p className="text-center text-gray-500">Loading sofas from database...</p>
        ) : sofas.length === 0 ? (
          <p className="text-center text-gray-500">No sofas found. Please add them from the Django Admin panel!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sofas.map((sofa) => (
              <div key={sofa.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between">
                <div>
                  {sofa.image ? (
                    <img src={sofa.image} alt={sofa.name} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="w-full h-64 bg-amber-100 flex items-center justify-center text-amber-800 font-medium text-lg">
                      🛋️ {sofa.name}
                    </div>
                  )}
                  
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      {sofa.tag || 'Bestseller'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{sofa.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{sofa.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-2xl font-bold text-amber-900">₹{sofa.price}</span>
                    {sofa.original_price && (
                      <span className="text-sm text-gray-400 line-through ml-2">₹{sofa.original_price}</span>
                    )}
                  </div>
                  <button type="button" onClick={() => alert(`${sofa.name} added to cart!`)} className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition font-medium shadow-sm cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Us */}
      <section id="about" className="py-16 bg-amber-50 px-4 sm:px-6 lg:px-8 my-12 rounded-3xl max-w-7xl mx-auto shadow-inner">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 mb-6">About SofaCraft</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Welcome to SofaCraft, your ultimate destination for handcrafted, premium-quality luxury sofas managed straight from our secure database.
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-16 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 mb-4">Get in Touch</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input type="text" required className="mt-1 w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" required className="mt-1 w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea rows="4" required className="mt-1 w-full px-4 py-2 border rounded-lg outline-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition font-medium cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-200 py-6 text-center text-sm border-t border-amber-900">
        <p>&copy; {new Date().getFullYear()} SofaCraft. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button type="button" onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer">✕</button>
            <div className="flex border-b mb-6">
              <button type="button" onClick={() => setIsLoginTab(true)} className={`flex-1 pb-2 font-semibold text-center cursor-pointer ${isLoginTab ? 'border-b-2 border-amber-800 text-amber-800' : 'text-gray-400'}`}>Login</button>
              <button type="button" onClick={() => setIsLoginTab(false)} className={`flex-1 pb-2 font-semibold text-center cursor-pointer ${!isLoginTab ? 'border-b-2 border-amber-800 text-amber-800' : 'text-gray-400'}`}>Register</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter your name" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" required value={passInput} onChange={(e) => setPassInput(e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter password" />
              </div>
              <button type="submit" className="w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition font-medium cursor-pointer">
                {isLoginTab ? 'Login' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
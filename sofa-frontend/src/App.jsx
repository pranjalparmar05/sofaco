import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Aapka Render Backend Base URL
  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000' 
    : 'https://sofaco.onrender.com';

  useEffect(() => {
    // Multi-endpoint fetch attempt (Pehle /api/sofas/, fir /api/products/, fir /products/)
    const fetchSofaData = async () => {
      const endpoints = [
        `${API_BASE}/api/sofas/`,
        `${API_BASE}/api/products/`,
        `${API_BASE}/products/`
      ];

      let success = false;

      for (const url of endpoints) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setSofas(Array.isArray(data) ? data : data.results || []);
            setLoading(false);
            success = true;
            break;
          }
        } catch (err) {
          console.log(`Failed fetching from ${url}`);
        }
      }

      if (!success) {
        setError('Backend database se connection nahi ho paa raha hai. Kripya check karein ki CORS and Endpoints allowed hain.');
        setLoading(false);
      }
    };

    fetchSofaData();
  }, [API_BASE]);

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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-800 selection:text-white">
      
      {/* 1. Glassmorphism Modern Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl font-black tracking-tight text-amber-900">
                Sofa<span className="text-amber-600">Craft</span>.
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-10 font-medium text-stone-600 text-sm tracking-wide">
              <a href="#home" className="hover:text-amber-800 transition">HOME</a>
              <a href="#products" className="hover:text-amber-800 transition">COLLECTION</a>
              <a href="#about" className="hover:text-amber-800 transition">ABOUT</a>
              <a href="#contact" className="hover:text-amber-800 transition">CONTACT</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <button 
                type="button"
                onClick={() => alert("Your cart is currently empty.")}
                className="p-2.5 text-stone-700 hover:text-amber-800 transition bg-stone-100 hover:bg-stone-200 rounded-full cursor-pointer relative"
              >
                🛒
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-stone-800 font-semibold text-sm">Hello, {user}</span>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="border border-red-500 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-50 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-amber-900 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-amber-950 transition shadow-md shadow-amber-900/10 cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. Premium Hero Section */}
      <section id="home" className="relative bg-stone-900 text-white py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-amber-500 font-semibold text-xs tracking-widest uppercase bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-800/50 inline-block mb-6">
            Handcrafted Luxury Living
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Elevate Your Space With Timeless Elegance
          </h1>
          <p className="text-lg sm:text-xl text-stone-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Discover bespoke artisan sofas designed for ultimate comfort, built with sustainable materials and unmatched craftsmanship.
          </p>
          <a 
            href="#products" 
            className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-8 py-4 rounded-2xl shadow-xl shadow-amber-900/30 transition duration-300 inline-block cursor-pointer"
          >
            Explore Collection →
          </a>
        </div>
      </section>

      {/* 3. Dynamic Products Section (Render Backend) */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">Our Signature Collection</h2>
          <p className="text-stone-500 mt-2">Fetched live directly from your Render PostgreSQL Database</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <p className="font-semibold">{error}</p>
          </div>
        ) : sofas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-lg mx-auto">
            <p className="text-stone-500 text-lg mb-2">No sofas found in database.</p>
            <p className="text-stone-400 text-sm">Please add products via your Django Admin panel (`/admin/`).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sofas.map((sofa) => (
              <div 
                key={sofa.id} 
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-stone-200/80 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-72 bg-stone-100 relative overflow-hidden flex items-center justify-center">
                    {sofa.image ? (
                      <img src={sofa.image} alt={sofa.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <span className="text-stone-400 font-medium">🛋️ {sofa.name || sofa.title}</span>
                    )}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {sofa.tag || 'Bestseller'}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-900 transition">{sofa.name || sofa.title}</h3>
                    <p className="text-stone-500 text-sm mt-2 line-clamp-2 leading-relaxed">{sofa.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-2xl font-black text-amber-900">₹{sofa.price}</span>
                    {sofa.original_price && (
                      <span className="text-sm text-stone-400 line-through ml-2 font-medium">₹{sofa.original_price}</span>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => alert(`${sofa.name || sofa.title} added to cart!`)}
                    className="bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-amber-900 transition font-medium text-sm shadow-md cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. About Us Section */}
      <section id="about" className="py-24 bg-stone-100 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-6">Crafted For Generations</h2>
          <p className="text-stone-600 text-lg leading-relaxed mb-6">
            At SofaCraft, we believe furniture shouldn't just fill a room—it should tell a story. Every sofa is meticulously engineered to provide supreme lumbar support, using kiln-dried hardwood frames and premium high-resilience cushioning.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-300 text-stone-800">
            <div>
              <h4 className="text-2xl font-bold text-amber-900">10 Years</h4>
              <p className="text-sm text-stone-500 mt-1">Warranty</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-amber-900">100%</h4>
              <p className="text-sm text-stone-500 mt-1">Solid Wood</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-amber-900">Free</h4>
              <p className="text-sm text-stone-500 mt-1">Home Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-stone-900">Let's Talk Design</h2>
            <p className="text-stone-500 mt-2 text-sm">Have a custom requirement? Send us a note.</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Your Name</label>
                <input type="text" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-stone-800" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-stone-800" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Message</label>
              <textarea rows="4" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-stone-800" placeholder="Describe your custom sofa query..."></textarea>
            </div>
            <button type="submit" className="w-full bg-amber-900 text-white py-4 rounded-xl hover:bg-amber-950 transition font-semibold shadow-lg shadow-amber-900/10 cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center text-sm border-t border-stone-800">
        <p>&copy; {new Date().getFullYear()} SofaCraft Inc. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative border border-stone-100">
            
            <button 
              type="button"
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 font-bold text-lg cursor-pointer bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-stone-900 mb-2">{isLoginTab ? 'Welcome Back' : 'Create Account'}</h3>
            <p className="text-stone-500 text-sm mb-6">{isLoginTab ? 'Enter your details to access your account' : 'Join SofaCraft for exclusive collections'}</p>

            <div className="flex bg-stone-100 p-1 rounded-2xl mb-6">
              <button 
                type="button"
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 py-2.5 font-semibold text-sm rounded-xl transition cursor-pointer ${isLoginTab ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 py-2.5 font-semibold text-sm rounded-xl transition cursor-pointer ${!isLoginTab ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Full Name</label>
                  <input type="text" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-800" placeholder="John Doe" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Email Address</label>
                <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-800" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Password</label>
                <input type="password" required value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-800" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-amber-900 text-white py-3.5 rounded-xl hover:bg-amber-950 transition font-medium shadow-md cursor-pointer mt-2">
                {isLoginTab ? 'Sign In' : 'Create Account'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
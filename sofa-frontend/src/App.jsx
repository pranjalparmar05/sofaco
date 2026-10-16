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

  // Premium, Luxurious Background Images (Right-side automatically scrolling)
  // Aap apni khud ki image URLs yahan replace kar sakte hain
  const backgroundImages = [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1920&auto=format&fit=crop', // Royal velvet, moody lighting
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1920&auto=format&fit=crop', // Leather, classic mid-century study
    'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1920&auto=format&fit=crop', // Silk velvet, gold accent, elegant room
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Automatically scroll background images to the right
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(bgInterval);
  }, [backgroundImages.length]);

  // Aapka Render Backend Base URL
  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000' 
    : 'https://sofaco.onrender.com';

  useEffect(() => {
    // Multi-endpoint fetch attempt
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
        setError('Backend database se connection nahi ho paa raha hai. Kripya check karein ki CORS aur Endpoints allowed hain.');
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
      
      {/* 1. Glassmorphism Modern Navbar (Transparent for Hero) */}
      <header className="bg-transparent backdrop-blur-md sticky top-0 z-50 w-full border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl font-black tracking-tight text-white group">
                Sofa<span className="text-amber-500 group-hover:text-amber-300 transition">Craft</span>.
              </span>
            </div>

            {/* Navigation Links (White text for dark bg) */}
            <nav className="hidden md:flex space-x-10 font-medium text-white/90 text-sm tracking-wide">
              <a href="#home" className="hover:text-amber-400 transition">HOME</a>
              <a href="#products" className="hover:text-amber-400 transition">COLLECTION</a>
              <a href="#about" className="hover:text-amber-400 transition">ABOUT</a>
              <a href="#contact" className="hover:text-amber-400 transition">CONTACT</a>
            </nav>

            {/* Actions (White icons/buttons) */}
            <div className="flex items-center space-x-6">
              <button 
                type="button"
                onClick={() => alert("Your cart is currently empty.")}
                className="p-2.5 text-white/80 hover:text-amber-400 transition bg-white/5 hover:bg-white/10 rounded-full cursor-pointer relative"
              >
                🛒
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white font-semibold text-sm">Hello, {user}</span>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="border border-red-400 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-950 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="bg-amber-800 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-amber-900 transition shadow-md shadow-amber-900/10 cursor-pointer"
              >
                Sign In
              </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. Premium Hero Section with Auto-Scrolling Background */}
      <section id="home" className="relative text-white min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        
        {/* Background Image Carousel (Smooth scrolling effect) */}
        <div className="absolute inset-0 z-0 flex transition-transform duration-[600ms] ease-out" style={{ transform: `translateX(-${currentBgIndex * 100}%)` }}>
          {backgroundImages.map((img, index) => (
            <div 
              key={index} 
              className="w-full h-full flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* Dark Premium Overlay (To make text pop) */}
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[1px]"></div>
        
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center relative z-20 pt-16 pb-24">
          <span className="text-amber-400 font-semibold text-xs tracking-widest uppercase bg-amber-950/90 px-3.5 py-1.5 rounded-full border border-amber-800 inline-block mb-6 shadow-md shadow-amber-950/20">
            Handcrafted Luxury Living
          </span>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight mb-8 leading-tight">
            Elevate Your Space With <span className="text-amber-300">Timeless</span> Elegance.
          </h1>
          <p className="text-lg sm:text-xl text-stone-200 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Discover bespoke artisan sofas designed for ultimate comfort, built with sustainable materials and unmatched craftsmanship.
          </p>
          <a 
            href="#products" 
            className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-10 py-4.5 rounded-full shadow-xl shadow-amber-900/30 transition duration-300 inline-block cursor-pointer text-base"
          >
            Explore Collection →
          </a>
        </div>
      </section>

      {/* 3. Dynamic Products Section (Render Backend) */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight">Our Signature Collection</h2>
          <p className="text-stone-600 mt-3 text-lg font-light">Fetched live directly from your Render PostgreSQL Database</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-950"></div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center shadow-inner">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        ) : sofas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
            <p className="text-stone-500 text-xl mb-3">No sofas found in database.</p>
            <p className="text-stone-400 text-base">Please add products via your Django Admin panel (`/admin/`).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sofas.map((sofa) => (
              <div 
                key={sofa.id} 
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 border border-stone-100 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-80 bg-stone-100 relative overflow-hidden flex items-center justify-center">
                    {sofa.image ? (
                      <img src={sofa.image} alt={sofa.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <span className="text-stone-400 font-medium">🛋️ {sofa.name || sofa.title}</span>
                    )}
                    <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm text-stone-950 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                      {sofa.tag || 'Bestseller'}
                    </span>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-stone-950 group-hover:text-amber-900 transition">{sofa.name || sofa.title}</h3>
                    <p className="text-stone-600 text-sm mt-3 line-clamp-3 leading-relaxed font-light">{sofa.description}</p>
                  </div>
                </div>

                <div className="p-8 pt-0 flex items-center justify-between mt-5">
                  <div>
                    <span className="text-3xl font-black text-amber-950">₹{sofa.price}</span>
                    {sofa.original_price && (
                      <span className="text-sm text-stone-400 line-through ml-3 font-medium">₹{sofa.original_price}</span>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => alert(`${sofa.name || sofa.title} added to cart!`)}
                    className="bg-stone-950 text-white px-6 py-3 rounded-xl hover:bg-amber-950 transition font-medium text-sm shadow-md cursor-pointer"
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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-950 mb-8 tracking-tight">Crafted For Generations</h2>
          <p className="text-stone-700 text-xl leading-relaxed mb-12 font-light">
            At SofaCraft, we believe furniture shouldn't just fill a room—it should tell a story. Every sofa is meticulously engineered to provide supreme lumbar support, using kiln-dried hardwood frames and premium high-resilience cushioning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-stone-300 text-stone-800">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
              <h4 className="text-4xl font-black text-amber-950">10 Years</h4>
              <p className="text-base text-stone-600 mt-2">Comprehensive Warranty</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
              <h4 className="text-4xl font-black text-amber-950">100%</h4>
              <p className="text-base text-stone-600 mt-2">Certified Solid Wood Frame</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
              <h4 className="text-4xl font-black text-amber-950">Free</h4>
              <p className="text-base text-stone-600 mt-2">Premium Home Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-10 sm:p-16 shadow-lg border border-stone-200">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-stone-950 tracking-tight">Let's Talk Design</h2>
            <p className="text-stone-600 mt-3 text-lg font-light">Have a custom requirement? Send us a note.</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2.5">Your Name</label>
                <input type="text" required className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-stone-800" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2.5">Email Address</label>
                <input type="email" required className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-stone-800" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2.5">Message</label>
              <textarea rows="5" required className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-stone-800" placeholder="Describe your custom sofa query..."></textarea>
            </div>
            <button type="submit" className="w-full bg-amber-900 text-white py-4.5 rounded-xl hover:bg-amber-950 transition font-semibold shadow-lg shadow-amber-900/10 cursor-pointer text-base">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 text-center text-sm border-t border-stone-800 mt-10">
        <p className="text-base text-stone-200 mb-3 font-medium">Sofa<span className="text-amber-500">Craft</span>.</p>
        <p className="font-light">&copy; {new Date().getFullYear()} SofaCraft Inc. All rights reserved.</p>
      </footer>

      {/* Auth Modal (Premium Design) */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative border border-stone-100 animate-fade-in">
            
            <button 
              type="button"
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 font-bold text-lg cursor-pointer bg-stone-100 w-9 h-9 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>

            <h3 className="text-3xl font-bold text-stone-950 mb-2">{isLoginTab ? 'Welcome Back' : 'Create Account'}</h3>
            <p className="text-stone-600 text-sm mb-8 font-light">{isLoginTab ? 'Enter your details to access your account' : 'Join SofaCraft for exclusive collections'}</p>

            <div className="flex bg-stone-100 p-1 rounded-2xl mb-8 border border-stone-200">
              <button 
                type="button"
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 py-3.5 font-semibold text-sm rounded-xl transition cursor-pointer ${isLoginTab ? 'bg-white text-stone-950 shadow-md' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 py-3.5 font-semibold text-sm rounded-xl transition cursor-pointer ${!isLoginTab ? 'bg-white text-stone-950 shadow-md' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Full Name</label>
                  <input type="text" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full px-4.5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-800" placeholder="John Doe" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Email Address</label>
                <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4.5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-800" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Password</label>
                <input type="password" required value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full px-4.5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-800" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-amber-900 text-white py-4 rounded-xl hover:bg-amber-950 transition font-medium shadow-md cursor-pointer mt-3 text-sm">
                {isLoginTab ? 'Sign In' : 'Create Account'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
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

  // 🔍 Filter & Search State
  const [priceRange, setPriceRange] = useState('ALL'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Product Details Modal State
  const [selectedSofaDetail, setSelectedSofaDetail] = useState(null);
  const [selectedColor, setSelectedColor] = useState('Royal Velvet');

  // ❤️ Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // ⭐ Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Lady Victoria Sterling', rating: 5, comment: 'The craftsmanship on the Royal Velvet piece is beyond breathtaking. Fits our Mumbai penthouse effortlessly.' },
    { id: 2, name: 'Rajesh Singhania', rating: 5, comment: 'Exceptional lumbar support and Italian leather finish. White-glove delivery service was top notch!' },
    { id: 3, name: 'Ananya Deshmukh', rating: 5, comment: 'Custom teakwood framework and 40-density foam comfort. Totally worth the investment.' },
    { id: 4, name: 'Vikramaditya Rao', rating: 5, comment: 'Solid hardwood frame and unmatched elegance. Highly recommended for premium interiors.' },
    { id: 5, name: 'Siddharth Malhotra', rating: 5, comment: 'The seating depth is perfect and velvet texture feels extremely rich.' }
  ]);
  const [showAllReviews, setShowAllReviews] = useState(false); // Toggle hidden reviews
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });

  // Cart & Order Drawer State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSofaForPayment, setSelectedSofaForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Cinematic Background Carousel
  const backgroundImages = [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2000&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop',
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 6000); 
    return () => clearInterval(bgInterval);
  }, [backgroundImages.length]);

  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000' 
    : 'https://sofaco.onrender.com';

  useEffect(() => {
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
        setError('Backend PostgreSQL database se connection establish nahi ho paya.');
        setLoading(false);
      }
    };

    fetchSofaData();
  }, [API_BASE]);

  const toggleWishlist = (e, sofa) => {
    e.stopPropagation();
    if (wishlist.some((item) => item.id === sofa.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== sofa.id));
    } else {
      setWishlist((prev) => [...prev, sofa]);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviews([{ id: Date.now(), ...newReview }, ...reviews]);
    setNewReview({ name: '', comment: '', rating: 5 });
    alert("Thank you! Your verified review has been published.");
  };

  const filteredSofas = sofas.filter((sofa) => {
    const sofaPrice = Number(sofa.price) || 0;
    const sofaName = (sofa.name || sofa.title || '').toLowerCase();
    
    let matchesPrice = true;
    if (priceRange === '10000') matchesPrice = sofaPrice <= 10000;
    else if (priceRange === '20000') matchesPrice = sofaPrice <= 20000;
    else if (priceRange === '30000') matchesPrice = sofaPrice <= 30000;
    else if (priceRange === '50000') matchesPrice = sofaPrice <= 50000;

    const matchesSearch = sofaName.includes(searchQuery.toLowerCase());

    return matchesPrice && matchesSearch;
  });

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const usernameToSet = isLoginTab ? (emailInput.split('@')[0] || 'Connoisseur') : (nameInput || 'Connoisseur');
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

  const handleOpenCheckout = (sofa) => {
    setSelectedSofaForPayment(sofa);
    setSelectedSofaDetail(null);
    setIsWishlistOpen(false);
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
    setIsCheckoutOpen(true);
  };

  const handleProcessFakePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      
      const newOrder = {
        orderId: 'SC-' + Math.floor(100000 + Math.random() * 900000),
        sofa: selectedSofaForPayment,
        color: selectedColor,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: paymentMethod.toUpperCase(),
      };
      
      setCart((prev) => [newOrder, ...prev]);
    }, 2000);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you certain you wish to revoke this commission order?")) {
      setCart((prev) => prev.filter((item) => item.orderId !== orderId));
    }
  };

  // Sirf pehle 3 reviews ya phir poore reviews dikhane ke liye logic
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 font-sans selection:bg-amber-600 selection:text-white antialiased">
      
      {/* 1. LUXURY NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0a09]/80 backdrop-blur-xl border-b border-stone-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-24 items-center">
            
            <div className="flex items-center space-x-3 cursor-pointer">
              <span className="text-2xl font-serif tracking-widest text-white uppercase font-bold">
                SOFA<span className="text-amber-500 font-normal">CRAFT</span>
              </span>
            </div>

            <nav className="hidden md:flex space-x-12 font-medium text-xs tracking-[0.2em] text-stone-300">
              <a href="#home" className="hover:text-amber-400 transition duration-300">SANCTUARY</a>
              <a href="#products" className="hover:text-amber-400 transition duration-300">COLLECTION</a>
              <a href="#about" className="hover:text-amber-400 transition duration-300">ATELIER</a>
              <a href="#contact" className="hover:text-amber-400 transition duration-300">INQUIRY</a>
              <a href="#reviews" className="hover:text-amber-400 transition duration-300">REVIEWS</a>
            </nav>

            <div className="flex items-center space-x-4 sm:space-x-6">
              
              <button 
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="p-3 text-stone-200 hover:text-red-400 transition bg-stone-900/80 hover:bg-stone-800 rounded-full relative border border-stone-800 shadow-inner cursor-pointer"
              >
                ❤️
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold tracking-tighter shadow-lg">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button 
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-3 text-stone-200 hover:text-amber-400 transition bg-stone-900/80 hover:bg-stone-800 rounded-full relative border border-stone-800 shadow-inner cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold tracking-tighter shadow-lg animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-4 bg-stone-900/60 px-4 py-2 rounded-2xl border border-stone-800">
                  <span className="text-amber-400 font-medium text-xs tracking-wider uppercase">{user}</span>
                  <button type="button" onClick={handleLogout} className="text-stone-400 hover:text-red-400 text-xs tracking-wider uppercase font-semibold transition cursor-pointer">
                    Exit
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsAuthOpen(true)} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-7 py-3 rounded-full font-medium text-xs tracking-[0.15em] uppercase hover:from-amber-500 hover:to-amber-600 transition duration-300 shadow-xl shadow-amber-950/50 cursor-pointer">
                  Member Access
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. CINEMATIC HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0 flex transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentBgIndex * 100}%)` }}>
          {backgroundImages.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img src={img} alt="Luxury Sofa" className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-110 scale-105" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/40 to-[#0c0a09]/65"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 pt-28">
          <div className="inline-flex items-center space-x-2 bg-stone-900/80 backdrop-blur-md px-5 py-2 rounded-full border border-stone-700/60 mb-8 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-amber-400 font-medium text-[11px] tracking-[0.25em] uppercase">Bespoke Artisan Living</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-tight mb-8 leading-[1.08] text-white">
            Sculpted for the <br />
            <span className="italic font-normal text-amber-200">Extraordinary</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 mb-14 font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
            Masterpiece seating architectures hand-crafted with architectural precision, premium sustainable hardwoods, and sublime Italian textiles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#products" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-medium px-10 py-4 rounded-full shadow-2xl shadow-amber-600/30 transition duration-300 uppercase tracking-[0.2em] text-xs cursor-pointer text-center">
              Explore Collection
            </a>
            <a href="#about" className="w-full sm:w-auto bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium px-10 py-4 rounded-full transition duration-300 uppercase tracking-[0.2em] text-xs cursor-pointer text-center backdrop-blur-md">
              The Atelier Heritage
            </a>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE COLLECTION */}
      <section id="products" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32">
        <div className="text-center mb-16">
          <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">PostgreSQL Live Inventory</span>
          <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-white">The Master Series</h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-6"></div>
        </div>

        <div className="mb-16 bg-stone-900/60 p-6 rounded-3xl border border-stone-800/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono uppercase text-stone-400 tracking-wider mr-2">Budget:</span>
            {[
              { label: 'All Sofas', value: 'ALL' },
              { label: 'Under ₹10,000', value: '10000' },
              { label: 'Under ₹20,000', value: '20000' },
              { label: 'Under ₹30,000', value: '30000' },
              { label: 'Under ₹50,000', value: '50000' },
            ].map((btn) => (
              <button
                key={btn.value}
                type="button"
                onClick={() => setPriceRange(btn.value)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold tracking-wider transition duration-300 cursor-pointer ${
                  priceRange === btn.value
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                    : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model name..." 
              className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-200 outline-none focus:border-amber-600"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-400 text-xs tracking-widest uppercase">Syncing Live Database...</p>
          </div>
        ) : error ? (
          <div className="max-w-lg mx-auto bg-red-950/30 border border-red-900/50 text-red-300 p-8 rounded-3xl text-center backdrop-blur-md">
            <p className="font-medium text-sm">{error}</p>
          </div>
        ) : filteredSofas.length === 0 ? (
          <div className="text-center py-24 bg-stone-900/40 rounded-3xl border border-stone-800/80 max-w-xl mx-auto p-12">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-stone-200 text-lg font-serif mb-2">No sofas found in this price range.</p>
            <button 
              type="button" 
              onClick={() => { setPriceRange('ALL'); setSearchQuery(''); }}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {filteredSofas.map((sofa) => {
              const isLiked = wishlist.some((item) => item.id === sofa.id);
              return (
                <div 
                  key={sofa.id} 
                  className="bg-stone-900/60 rounded-3xl border border-stone-800/80 overflow-hidden flex flex-col justify-between group hover:border-amber-600/50 transition duration-500 shadow-2xl cursor-pointer relative"
                  onClick={() => setSelectedSofaDetail(sofa)}
                >
                  <div>
                    <div className="w-full h-80 bg-stone-950 relative overflow-hidden flex items-center justify-center">
                      {sofa.image ? (
                        <img src={sofa.image} alt={sofa.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 filter brightness-95" />
                      ) : (
                        <span className="text-stone-600 font-serif italic text-lg">SofaCraft Archive</span>
                      )}
                      
                      <span className="absolute top-5 left-5 bg-[#0c0a09]/90 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-stone-800 shadow-xl">
                        {sofa.tag || 'Exclusive'}
                      </span>

                      <span className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-md text-amber-400 text-[11px] font-bold tracking-wider px-3 py-1 rounded-full border border-stone-800 shadow-lg">
                        ⭐ 4.9/5
                      </span>

                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(e, sofa)}
                        className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer ${
                          isLiked ? 'bg-red-950/80 border-red-700 text-red-500' : 'bg-[#0c0a09]/70 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {isLiked ? '❤️' : '🤍'}
                      </button>

                      <span className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-md text-stone-300 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-stone-700">
                        View Specs 🔍
                      </span>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-serif text-white group-hover:text-amber-300 transition duration-300">{sofa.name || sofa.title}</h3>
                      <p className="text-stone-400 text-xs mt-3 line-clamp-3 leading-relaxed font-light">{sofa.description}</p>
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex items-center justify-between mt-6" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <span className="text-2xl font-serif font-bold text-amber-400">₹{sofa.price}</span>
                      {sofa.original_price && (
                        <span className="text-xs text-stone-500 line-through ml-3 font-mono">₹{sofa.original_price}</span>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleOpenCheckout(sofa)}
                      className="bg-stone-100 hover:bg-amber-600 text-stone-950 hover:text-white px-6 py-3 rounded-full font-medium text-xs tracking-widest uppercase transition duration-300 shadow-lg cursor-pointer"
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. ATELIER HERITAGE */}
      <section id="about" className="py-32 bg-[#120f0d] border-y border-stone-800/80 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Uncompromising Standards</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-white mb-10 tracking-tight">The Art of Timeless Craft</h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-16 font-light">
            Every creation is an uncompromising synthesis of architectural discipline and tactile indulgence.
          </p>
        </div>
      </section>

      {/* 5. INQUIRY SECTION */}
      <section id="contact" className="py-32 max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-stone-900/60 rounded-3xl p-10 sm:p-16 border border-stone-800 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-white">Private Commission Inquiry</h2>
            <p className="text-stone-400 text-xs tracking-widest uppercase mt-3">Connect with our master artisans</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert("Your inquiry has been transmitted securely."); }} className="space-y-6">
            <input type="text" placeholder="Full Name" required className="w-full px-5 py-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100" />
            <input type="email" placeholder="Email" required className="w-full px-5 py-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100" />
            <textarea rows="4" placeholder="Commission specifications..." required className="w-full px-5 py-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100"></textarea>
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase transition cursor-pointer">
              Transmit Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* 6. ⭐ CLIENT REVIEWS & TESTIMONIALS SECTION (NOW AT THE VERY BOTTOM) */}
      <section id="reviews" className="py-32 bg-[#0a0807] border-t border-stone-800/80 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Client Satisfaction</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">Verified Connoisseur Reviews</h2>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-6"></div>
          </div>

          {/* Reviews Grid (Maximum 3 by default) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {displayedReviews.map((rev) => (
              <div key={rev.id} className="bg-stone-900/60 p-8 rounded-3xl border border-stone-800/80 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {'⭐'.repeat(rev.rating)}
                  </div>
                  <p className="text-stone-300 text-sm font-light leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="border-t border-stone-800/60 pt-4">
                  <h4 className="font-serif text-white text-base">{rev.name}</h4>
                  <p className="text-[10px] text-amber-500 uppercase tracking-widest mt-0.5">Verified Owner</p>
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Show Less Button if reviews > 3 */}
          {reviews.length > 3 && (
            <div className="text-center mb-16">
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-200 px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition duration-300 cursor-pointer shadow-lg"
              >
                {showAllReviews ? 'Show Fewer Reviews ▲' : `View All Reviews (${reviews.length}) ▼`}
              </button>
            </div>
          )}

          {/* Submit Review Form */}
          <div className="bg-stone-950 p-8 rounded-3xl border border-stone-800 max-w-2xl mx-auto">
            <h3 className="text-xl font-serif text-white mb-4 text-center">Write a Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                required 
                className="w-full px-5 py-3.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-stone-100 outline-none focus:border-amber-600"
              />
              <textarea 
                rows="3" 
                placeholder="Share your experience with SofaCraft..." 
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required 
                className="w-full px-5 py-3.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-stone-100 outline-none focus:border-amber-600"
              ></textarea>
              <button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-16 text-center text-xs border-t border-stone-900">
        <p className="font-serif text-lg tracking-widest text-white mb-2">SOFACRAFT ATELIER</p>
        <p className="tracking-[0.2em] uppercase text-stone-500">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </footer>

      {/* 7. WISHLIST ❤️ DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex justify-end">
          <div className="bg-[#120f0d] w-full max-w-md h-full p-8 shadow-2xl flex flex-col justify-between border-l border-stone-800 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-6 mb-8">
                <h3 className="text-lg font-serif text-white tracking-wide flex items-center">
                  Saved Favorites ❤️ <span className="ml-3 text-xs bg-red-950 text-red-400 font-bold px-3 py-1 rounded-full border border-red-800/60">{wishlist.length}</span>
                </h3>
                <button type="button" onClick={() => setIsWishlistOpen(false)} className="text-stone-400 hover:text-white text-lg font-bold p-2 cursor-pointer">✕</button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-32 text-stone-500">
                  <p className="text-4xl mb-4">🤍</p>
                  <p className="font-serif text-stone-300 text-base mb-1">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {wishlist.map((sofa) => (
                    <div key={sofa.id} className="border border-stone-800 rounded-3xl p-5 bg-stone-900/40 relative shadow-xl flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-stone-950 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-stone-800">
                          {sofa.image ? (
                            <img src={sofa.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            '🏛️'
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif text-white text-base">{sofa.name || sofa.title}</h4>
                          <p className="text-amber-300 font-bold text-sm">₹{sofa.price}</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          type="button"
                          onClick={() => handleOpenCheckout(sofa)}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-3 py-2 rounded-xl uppercase tracking-wider cursor-pointer"
                        >
                          Acquire
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(e, sofa)}
                          className="text-stone-500 hover:text-red-400 text-[10px] text-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-stone-800 pt-6 mt-6">
              <button type="button" onClick={() => setIsWishlistOpen(false)} className="w-full bg-stone-100 text-stone-950 py-4 rounded-full font-medium text-xs tracking-widest uppercase hover:bg-white transition cursor-pointer">
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. PRODUCT DETAILS MODAL */}
      {selectedSofaDetail && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-[#120f0d] rounded-3xl shadow-2xl max-w-3xl w-full p-8 sm:p-10 relative border border-stone-800 overflow-y-auto max-h-[90vh]">
            <button type="button" onClick={() => setSelectedSofaDetail(null)} className="absolute top-6 right-6 text-stone-400 hover:text-white font-bold text-lg bg-stone-900 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-stone-800">✕</button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="w-full h-80 bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center relative">
                {selectedSofaDetail.image ? (
                  <img src={selectedSofaDetail.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-stone-600 font-serif italic">No preview image</span>
                )}
                <span className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-stone-800">
                  360° Quality Inspected
                </span>
              </div>

              <div className="space-y-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
                  {selectedSofaDetail.tag || 'Master Craftsman Edition'}
                </span>
                
                <h3 className="text-3xl font-serif text-white">{selectedSofaDetail.name || selectedSofaDetail.title}</h3>
                <p className="text-amber-400 font-serif text-2xl font-bold">₹{selectedSofaDetail.price}</p>
                <p className="text-stone-400 text-xs leading-relaxed font-light">{selectedSofaDetail.description}</p>

                <div className="border-t border-b border-stone-800 py-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-stone-500 uppercase tracking-wider text-[10px]">Timber Framework</p>
                    <p className="text-stone-200 font-medium mt-0.5">Teakwood & Sheesham</p>
                  </div>
                  <div>
                    <p className="text-stone-500 uppercase tracking-wider text-[10px]">Cushion Density</p>
                    <p className="text-stone-200 font-medium mt-0.5">40 High-Resilience Foam</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCheckout(selectedSofaDetail)}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase transition shadow-xl cursor-pointer mt-2"
                >
                  Proceed to Acquire →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. ACTIVE ORDERS DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex justify-end">
          <div className="bg-[#120f0d] w-full max-w-md h-full p-8 shadow-2xl flex flex-col justify-between border-l border-stone-800 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-6 mb-8">
                <h3 className="text-lg font-serif text-white tracking-wide flex items-center">
                  Active Commissions <span className="ml-3 text-xs bg-amber-600/20 text-amber-400 font-bold px-3 py-1 rounded-full border border-amber-600/30">{cart.length}</span>
                </h3>
                <button type="button" onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-white text-lg font-bold p-2 cursor-pointer">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-32 text-stone-500">
                  <p className="text-4xl mb-4">📭</p>
                  <p className="font-serif text-stone-300 text-base mb-1">No active commissions registered.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.orderId} className="border border-stone-800 rounded-3xl p-5 bg-stone-900/40 relative shadow-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-stone-950 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-stone-800">
                          {item.sofa.image ? (
                            <img src={item.sofa.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            '🏛️'
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-800/60 uppercase tracking-widest">
                            {item.method} • SECURED
                          </span>
                          <h4 className="font-serif text-white text-base mt-1.5">{item.sofa.name || item.sofa.title}</h4>
                          <p className="text-amber-300 font-bold text-sm">₹{item.sofa.price}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancelOrder(item.orderId)}
                        className="mt-4 w-full border border-red-950 bg-red-950/20 hover:bg-red-950/50 text-red-400 text-[11px] font-semibold py-2.5 rounded-xl transition uppercase tracking-widest cursor-pointer"
                      >
                        Revoke Commission
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-stone-800 pt-6 mt-6">
                <button type="button" onClick={() => setIsCartOpen(false)} className="w-full bg-stone-100 text-stone-950 py-4 rounded-full font-medium text-xs tracking-widest uppercase hover:bg-white transition cursor-pointer">
                  Return to Sanctuary
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. CHECKOUT MODAL */}
      {isCheckoutOpen && selectedSofaForPayment && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-[#120f0d] rounded-3xl shadow-2xl max-w-lg w-full p-10 relative border border-stone-800">
            <button type="button" onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-stone-400 hover:text-white font-bold text-lg bg-stone-900 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-stone-800">
              ✕
            </button>

            {!paymentSuccess ? (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-800/60">
                  Concierge Payment Gateway
                </span>
                
                <h3 className="text-3xl font-serif text-white mt-4 mb-1">Secure Acquisition</h3>

                <div className="bg-stone-950 border border-stone-800 p-5 rounded-3xl flex items-center space-x-4 my-6">
                  <div className="w-16 h-16 bg-stone-900 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-stone-800">
                    {selectedSofaForPayment.image ? (
                      <img src={selectedSofaForPayment.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      '🏛️'
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-white text-lg">{selectedSofaForPayment.name || selectedSofaForPayment.title}</h4>
                    <p className="text-amber-400 font-bold text-base">₹{selectedSofaForPayment.price}</p>
                  </div>
                </div>

                <form onSubmit={handleProcessFakePayment} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`p-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider border cursor-pointer ${paymentMethod === 'card' ? 'border-amber-600 bg-amber-950/40 text-amber-300' : 'border-stone-800 bg-stone-950 text-stone-400'}`}>💳 Card</button>
                    <button type="button" onClick={() => setPaymentMethod('upi')} className={`p-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider border cursor-pointer ${paymentMethod === 'upi' ? 'border-amber-600 bg-amber-950/40 text-amber-300' : 'border-stone-800 bg-stone-950 text-stone-400'}`}>📱 UPI</button>
                    <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider border cursor-pointer ${paymentMethod === 'cod' ? 'border-amber-600 bg-amber-950/40 text-amber-300' : 'border-stone-800 bg-stone-950 text-stone-400'}`}>💵 COD</button>
                  </div>

                  <button type="submit" disabled={isProcessingPayment} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase transition cursor-pointer">
                    {isProcessingPayment ? "Authorizing Secure Transfer... ⏳" : `Authorize ₹${selectedSofaForPayment.price} →`}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-950/60 text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-800">
                  ✓
                </div>
                <h3 className="text-3xl font-serif text-white">Acquisition Confirmed</h3>
                <div className="mt-8 flex space-x-4">
                  <button type="button" onClick={() => { setIsCheckoutOpen(false); setIsCartOpen(true); }} className="flex-1 bg-amber-600 text-white py-3.5 rounded-full font-medium text-xs tracking-widest uppercase cursor-pointer">
                    View Portfolio 🛒
                  </button>
                  <button type="button" onClick={() => setIsCheckoutOpen(false)} className="flex-1 border border-stone-700 text-stone-300 py-3.5 rounded-full font-medium text-xs tracking-widest uppercase cursor-pointer">
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MEMBER ACCESS MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-[#120f0d] rounded-3xl shadow-2xl max-w-md w-full p-10 relative border border-stone-800">
            <button type="button" onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-stone-400 hover:text-white font-bold">✕</button>
            <h3 className="text-3xl font-serif text-white mb-2">{isLoginTab ? 'Member Access' : 'Register Profile'}</h3>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-5 py-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs outline-none text-stone-100" placeholder="arthur@domain.com" />
              <input type="password" required value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full px-5 py-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs outline-none text-stone-100" placeholder="••••••••" />
              <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase cursor-pointer">
                {isLoginTab ? 'Authenticate' : 'Register Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
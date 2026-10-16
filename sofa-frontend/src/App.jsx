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

  // 🛋️ 1. 3D MATERIAL CUSTOMIZER STATE
  const [customMaterial, setCustomMaterial] = useState('Velvet');
  const [customColor, setCustomColor] = useState('#8B5CF6'); // Violet Velvet default
  const [customWood, setCustomWood] = useState('Teak');

  // 🧩 2. MODULAR BUILDER STATE
  const [selectedModules, setSelectedModules] = useState(['main-2seater']);
  const modulePrices = {
    'main-2seater': { name: 'Main 2-Seater Base', price: 45000 },
    'l-chaise': { name: 'L-Shape Lounge Chaise', price: 22000 },
    'ottoman': { name: 'Plush Velvet Ottoman', price: 12000 },
    'recliner': { name: 'Electric Power Recliner', price: 28000 }
  };

  const calculateModularTotal = () => {
    return selectedModules.reduce((total, modKey) => total + modulePrices[modKey].price, 0);
  };

  const toggleModule = (modKey) => {
    if (modKey === 'main-2seater') return; // Base module required
    if (selectedModules.includes(modKey)) {
      setSelectedModules(selectedModules.filter(item => item !== modKey));
    } else {
      setSelectedModules([...selectedModules, modKey]);
    }
  };

  // Product Details Modal State
  const [selectedSofaDetail, setSelectedSofaDetail] = useState(null);

  // ❤️ Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // ⭐ Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Lady Victoria Sterling', rating: 5, comment: 'The craftsmanship on the Royal Velvet piece is beyond breathtaking.' },
    { id: 2, name: 'Rajesh Singhania', rating: 5, comment: 'Exceptional lumbar support and Italian leather finish. Top notch!' },
    { id: 3, name: 'Ananya Deshmukh', rating: 5, comment: 'Custom teakwood framework and 40-density foam comfort.' },
    { id: 4, name: 'Vikramaditya Rao', rating: 5, comment: 'Solid hardwood frame and unmatched elegance.' }
  ]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });

  // Cart & Order Drawer State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSofaForPayment, setSelectedSofaForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Background Carousel
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
    alert("Thank you! Your review has been published.");
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

            <nav className="hidden lg:flex space-x-10 font-medium text-xs tracking-[0.2em] text-stone-300">
              <a href="#home" className="hover:text-amber-400 transition">SANCTUARY</a>
              <a href="#customizer" className="hover:text-amber-400 transition">3D CUSTOMIZER</a>
              <a href="#storytelling" className="hover:text-amber-400 transition">INTERNAL CRAFT</a>
              <a href="#modular" className="hover:text-amber-400 transition">MODULAR BUILDER</a>
              <a href="#products" className="hover:text-amber-400 transition">COLLECTION</a>
              <a href="#reviews" className="hover:text-amber-400 transition">REVIEWS</a>
            </nav>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <button type="button" onClick={() => setIsWishlistOpen(true)} className="p-3 text-stone-200 hover:text-red-400 transition bg-stone-900/80 hover:bg-stone-800 rounded-full relative border border-stone-800 cursor-pointer">
                ❤️
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button type="button" onClick={() => setIsCartOpen(true)} className="p-3 text-stone-200 hover:text-amber-400 transition bg-stone-900/80 hover:bg-stone-800 rounded-full relative border border-stone-800 cursor-pointer">
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-4 bg-stone-900/60 px-4 py-2 rounded-2xl border border-stone-800">
                  <span className="text-amber-400 font-medium text-xs tracking-wider uppercase">{user}</span>
                  <button type="button" onClick={handleLogout} className="text-stone-400 hover:text-red-400 text-xs tracking-wider uppercase font-semibold cursor-pointer">
                    Exit
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsAuthOpen(true)} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-7 py-3 rounded-full font-medium text-xs tracking-[0.15em] uppercase hover:from-amber-500 hover:to-amber-600 transition shadow-xl shadow-amber-950/50 cursor-pointer">
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
            <span className="text-amber-400 font-medium text-[11px] tracking-[0.25em] uppercase">Bespoke Architectural Engineering</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-tight mb-8 leading-[1.08] text-white">
            Sculpted for the <br />
            <span className="italic font-normal text-amber-200">Extraordinary</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 mb-14 font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
            Experience real-time 3D customizers, exploded structural storytelling, and modular living room builders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#customizer" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-medium px-10 py-4 rounded-full shadow-2xl shadow-amber-600/30 transition uppercase tracking-[0.2em] text-xs text-center cursor-pointer">
              Launch 3D Customizer 🎨
            </a>
            <a href="#modular" className="w-full sm:w-auto bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium px-10 py-4 rounded-full transition uppercase tracking-[0.2em] text-xs text-center backdrop-blur-md cursor-pointer">
              Build Modular Room 🧩
            </a>
          </div>
        </div>
      </section>

      {/* 🔮 FEATURE 1: 3D INTERACTIVE MATERIAL CUSTOMIZER CANVAS */}
      <section id="customizer" className="py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 border-b border-stone-800/80">
        <div className="text-center mb-16">
          <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Interactive Studio</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-white">Real-Time Material Customizer</h2>
          <p className="text-stone-400 text-xs tracking-widest uppercase mt-3">Select textures, colors and teak finishes with live canvas feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-stone-900/40 p-8 sm:p-12 rounded-3xl border border-stone-800 shadow-2xl">
          {/* 3D Visual Preview Canvas */}
          <div className="lg:col-span-7 w-full h-[450px] bg-stone-950 rounded-3xl border border-stone-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900/50 to-amber-950/20"></div>
            
            {/* Dynamic Rendered Sofa Graphic Representation */}
            <div className="relative z-10 text-center transition-all duration-700 transform hover:scale-105">
              <div 
                className="w-72 h-44 sm:w-96 sm:h-52 rounded-3xl shadow-2xl flex flex-col justify-end p-6 border-4 border-stone-800 transition-colors duration-500"
                style={{ backgroundColor: customColor, boxShadow: `0 20px 50px ${customColor}40` }}
              >
                <div className="bg-stone-950/80 backdrop-blur-md p-4 rounded-2xl border border-stone-700/80 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">{customMaterial} Series</span>
                  <h4 className="text-white font-serif text-lg">Custom Atelier Sofa</h4>
                  <p className="text-[10px] text-stone-400 font-mono mt-1">Base: {customWood} Timber Framework</p>
                </div>
              </div>
            </div>

            <span className="absolute bottom-6 right-6 bg-stone-900/90 text-stone-300 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-stone-700">
              3D Live Interactive Render
            </span>
          </div>

          {/* Customizer Control Panel */}
          <div className="lg:col-span-5 space-y-8">
            {/* Fabric / Leather Material Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">1. Select Material Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['Velvet', 'Italian Leather', 'Organic Linen'].map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setCustomMaterial(mat)}
                    className={`py-3 px-2 rounded-2xl text-[11px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                      customMaterial === mat ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-stone-950 text-stone-400 border-stone-800'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">2. Select Fabric Shade</label>
              <div className="flex space-x-4">
                {[
                  { name: 'Royal Violet', code: '#5B21B6' },
                  { name: 'Emerald Green', code: '#065F46' },
                  { name: 'Obsidian Navy', code: '#1E3A8A' },
                  { name: 'Amber Gold', code: '#B45309' },
                  { name: 'Charcoal Grey', code: '#374151' }
                ].map((clr) => (
                  <button
                    key={clr.code}
                    type="button"
                    onClick={() => setCustomColor(clr.code)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 cursor-pointer ${
                      customColor === clr.code ? 'border-white scale-110 ring-4 ring-amber-500/50' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: clr.code }}
                    title={clr.name}
                  />
                ))}
              </div>
            </div>

            {/* Timber Base Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">3. Hardwood Base Finish</label>
              <div className="grid grid-cols-2 gap-3">
                {['Teakwood', 'Sheesham Dark', 'Walnut Wood', 'Brass Gold Legs'].map((wood) => (
                  <button
                    key={wood}
                    type="button"
                    onClick={() => setCustomWood(wood)}
                    className={`py-3 px-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                      customWood === wood ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-stone-950 text-stone-400 border-stone-800'
                    }`}
                  >
                    {wood}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCheckout({ id: 'custom-3d', name: `Custom ${customMaterial} Sofa (${customWood})`, price: 68000, image: '' })}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase transition shadow-2xl cursor-pointer"
            >
              Order Custom Specification (₹68,000) →
            </button>
          </div>
        </div>
      </section>

      {/* 🚀 FEATURE 2: APPLE-STYLE EXPLODED LAYER STORYTELLING */}
      <section id="storytelling" className="py-32 bg-[#120f0d] border-b border-stone-800/80 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Internal Architecture</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-white">Exploded Layer Craftsmanship</h2>
            <p className="text-stone-400 text-xs tracking-widest uppercase mt-3">Anatomy of an unyielding architectural seating masterpiece</p>
          </div>

          {/* Exploded Layers Interactive Breakdown */}
          <div className="space-y-8">
            {[
              { step: '01', title: 'Solid Kiln-Dried Hardwood Framework', desc: 'Sustainably harvested teakwood frames engineered to withstand over 500kg load with lifetime zero-creak guarantee.', tag: '100% Certified Teak' },
              { step: '02', title: 'Dual-Spring Heavy Steel Suspension', desc: 'Italian S-shaped serpentine steel springs wrapped in acoustic damping mesh for silent, luxurious bounce back.', tag: 'Zero Sag Tech' },
              { step: '03', title: '40-Density Multi-Core Memory Foam', desc: 'Pressure-relieving ergonomic foam layers contoured to support natural spinal posture during prolonged seating.', tag: 'Orthopedic Lumbar' },
              { step: '04', title: 'Hand-Stitched Italian Velvet Cover', desc: 'Stain-resistant hydrophobic velvet fabric hand-tufted by master artisans with over 20 years of experience.', tag: 'Hand-crafted Finish' }
            ].map((layer, index) => (
              <div 
                key={layer.step}
                className="bg-stone-950/80 p-8 rounded-3xl border border-stone-800/80 hover:border-amber-600/60 transition duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
              >
                <div className="flex items-center space-x-6">
                  <span className="text-4xl font-serif font-bold text-amber-500 opacity-80">{layer.step}</span>
                  <div>
                    <h3 className="text-2xl font-serif text-white">{layer.title}</h3>
                    <p className="text-stone-400 text-xs font-light leading-relaxed mt-2 max-w-xl">{layer.desc}</p>
                  </div>
                </div>
                <span className="bg-amber-950/60 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-amber-800/60 self-start md:self-auto">
                  {layer.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧩 FEATURE 3: DYNAMIC LIVING ROOM MODULAR CONFIGURATOR */}
      <section id="modular" className="py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 border-b border-stone-800/80">
        <div className="text-center mb-16">
          <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Room Architecture</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-white">Modular Living Room Builder</h2>
          <p className="text-stone-400 text-xs tracking-widest uppercase mt-3">Add or remove modules to build your perfect custom layout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-stone-900/40 p-8 sm:p-12 rounded-3xl border border-stone-800 shadow-2xl">
          {/* Dynamic Modular Canvas Visualizer */}
          <div className="lg:col-span-7 w-full h-[400px] bg-stone-950 rounded-3xl border border-stone-800 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              {selectedModules.map((modKey) => (
                <div key={modKey} className="bg-amber-950/60 border border-amber-600/60 p-6 rounded-2xl text-center shadow-2xl animate-fade-in">
                  <span className="text-2xl block mb-1">🛋️</span>
                  <span className="text-xs font-serif font-bold text-white block">{modulePrices[modKey].name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">₹{modulePrices[modKey].price}</span>
                </div>
              ))}
            </div>

            <span className="absolute bottom-6 left-6 bg-stone-900/90 text-stone-400 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-stone-800">
              Modules Selected: {selectedModules.length}
            </span>
          </div>

          {/* Module Selector Panel */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-serif text-white">Configure Modules:</h3>

            <div className="space-y-3">
              {Object.keys(modulePrices).map((modKey) => {
                const isSelected = selectedModules.includes(modKey);
                return (
                  <div 
                    key={modKey}
                    onClick={() => toggleModule(modKey)}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isSelected ? 'bg-amber-950/40 border-amber-600 text-white' : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-sm">{modulePrices[modKey].name}</h4>
                      <p className="text-xs text-amber-400 font-mono mt-0.5">₹{modulePrices[modKey].price}</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-stone-700">
                      {isSelected ? '✓ Added' : '+ Add'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-stone-800 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Total Custom Price:</span>
                <span className="text-3xl font-serif font-bold text-amber-400">₹{calculateModularTotal()}</span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout({ id: 'modular-build', name: `Custom Modular Layout (${selectedModules.length} Modules)`, price: calculateModularTotal(), image: '' })}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase transition shadow-2xl cursor-pointer"
              >
                Acquire Modular Configuration →
              </button>
            </div>
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
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-400 text-xs tracking-widest uppercase">Syncing Live Database...</p>
          </div>
        ) : filteredSofas.length === 0 ? (
          <div className="text-center py-24 bg-stone-900/40 rounded-3xl border border-stone-800/80 max-w-xl mx-auto p-12">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-stone-200 text-lg font-serif mb-2">No sofas found in this price range.</p>
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
                      
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(e, sofa)}
                        className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer ${
                          isLiked ? 'bg-red-950/80 border-red-700 text-red-500' : 'bg-[#0c0a09]/70 border-stone-800 text-stone-400'
                        }`}
                      >
                        {isLiked ? '❤️' : '🤍'}
                      </button>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-serif text-white group-hover:text-amber-300 transition duration-300">{sofa.name || sofa.title}</h3>
                      <p className="text-stone-400 text-xs mt-3 line-clamp-3 leading-relaxed font-light">{sofa.description}</p>
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex items-center justify-between mt-6" onClick={(e) => e.stopPropagation()}>
                    <span className="text-2xl font-serif font-bold text-amber-400">₹{sofa.price}</span>
                    <button 
                      type="button"
                      onClick={() => handleOpenCheckout(sofa)}
                      className="bg-stone-100 hover:bg-amber-600 text-stone-950 hover:text-white px-6 py-3 rounded-full font-medium text-xs tracking-widest uppercase transition duration-300 cursor-pointer"
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

      {/* 6. ⭐ CLIENT REVIEWS & TESTIMONIALS SECTION */}
      <section id="reviews" className="py-32 bg-[#0a0807] border-t border-stone-800/80 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Client Satisfaction</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">Verified Connoisseur Reviews</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {displayedReviews.map((rev) => (
              <div key={rev.id} className="bg-stone-900/60 p-8 rounded-3xl border border-stone-800/80 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-4">{'⭐'.repeat(rev.rating)}</div>
                  <p className="text-stone-300 text-sm font-light leading-relaxed italic mb-6">"{rev.comment}"</p>
                </div>
                <div className="border-t border-stone-800/60 pt-4">
                  <h4 className="font-serif text-white text-base">{rev.name}</h4>
                  <p className="text-[10px] text-amber-500 uppercase tracking-widest mt-0.5">Verified Owner</p>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="text-center mb-16">
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-200 px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition cursor-pointer"
              >
                {showAllReviews ? 'Show Fewer Reviews ▲' : `View All Reviews (${reviews.length}) ▼`}
              </button>
            </div>
          )}

          <div className="bg-stone-950 p-8 rounded-3xl border border-stone-800 max-w-2xl mx-auto">
            <h3 className="text-xl font-serif text-white mb-4 text-center">Write a Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <input type="text" placeholder="Your Name" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} required className="w-full px-5 py-3.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-stone-100 outline-none" />
              <textarea rows="3" placeholder="Share your experience..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} required className="w-full px-5 py-3.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-stone-100 outline-none"></textarea>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition cursor-pointer">
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

      {/* WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex justify-end">
          <div className="bg-[#120f0d] w-full max-w-md h-full p-8 shadow-2xl flex flex-col justify-between border-l border-stone-800 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-6 mb-8">
                <h3 className="text-lg font-serif text-white tracking-wide">Saved Favorites ❤️ ({wishlist.length})</h3>
                <button type="button" onClick={() => setIsWishlistOpen(false)} className="text-stone-400 hover:text-white text-lg font-bold p-2 cursor-pointer">✕</button>
              </div>

              {wishlist.map((sofa) => (
                <div key={sofa.id} className="border border-stone-800 rounded-3xl p-5 bg-stone-900/40 mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-white text-base">{sofa.name || sofa.title}</h4>
                    <p className="text-amber-300 font-bold text-sm">₹{sofa.price}</p>
                  </div>
                  <button type="button" onClick={() => handleOpenCheckout(sofa)} className="bg-amber-600 text-white text-[10px] font-bold px-3 py-2 rounded-xl uppercase">Acquire</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setIsWishlistOpen(false)} className="w-full bg-stone-100 text-stone-950 py-4 rounded-full font-medium text-xs tracking-widest uppercase">Close Drawer</button>
          </div>
        </div>
      )}

      {/* ACTIVE ORDERS DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex justify-end">
          <div className="bg-[#120f0d] w-full max-w-md h-full p-8 shadow-2xl flex flex-col justify-between border-l border-stone-800 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-6 mb-8">
                <h3 className="text-lg font-serif text-white tracking-wide">Active Commissions ({cart.length})</h3>
                <button type="button" onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-white text-lg font-bold p-2 cursor-pointer">✕</button>
              </div>

              {cart.map((item) => (
                <div key={item.orderId} className="border border-stone-800 rounded-3xl p-5 bg-stone-900/40 mb-4">
                  <h4 className="font-serif text-white text-base">{item.sofa.name || item.sofa.title}</h4>
                  <p className="text-amber-300 font-bold text-sm">₹{item.sofa.price}</p>
                  <button type="button" onClick={() => handleCancelOrder(item.orderId)} className="mt-3 w-full border border-red-950 bg-red-950/20 text-red-400 text-[11px] font-semibold py-2 rounded-xl uppercase">Revoke Commission</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setIsCartOpen(false)} className="w-full bg-stone-100 text-stone-950 py-4 rounded-full font-medium text-xs tracking-widest uppercase">Close</button>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && selectedSofaForPayment && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-[#120f0d] rounded-3xl shadow-2xl max-w-lg w-full p-10 relative border border-stone-800">
            <button type="button" onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-stone-400 hover:text-white font-bold">✕</button>

            {!paymentSuccess ? (
              <div>
                <h3 className="text-3xl font-serif text-white mb-2">Secure Acquisition</h3>
                <p className="text-amber-400 font-bold text-xl mb-6">₹{selectedSofaForPayment.price}</p>
                <form onSubmit={handleProcessFakePayment} className="space-y-6">
                  <button type="submit" disabled={isProcessingPayment} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-full font-medium text-xs tracking-[0.2em] uppercase transition cursor-pointer">
                    {isProcessingPayment ? "Authorizing Transfer... ⏳" : `Authorize ₹${selectedSofaForPayment.price} →`}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-950/60 text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-800">✓</div>
                <h3 className="text-3xl font-serif text-white">Acquisition Confirmed</h3>
                <button type="button" onClick={() => setIsCheckoutOpen(false)} className="mt-6 w-full bg-amber-600 text-white py-3.5 rounded-full text-xs uppercase font-bold">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
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

  // Cart, Orders & Payment State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Right side Cart Drawer toggle
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSofaForPayment, setSelectedSofaForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Background Carousel Images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1920&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1920&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1920&auto=format&fit=crop',
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
        setError('Backend database se connection nahi ho paa raha hai.');
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

  // Trigger Fake Payment Modal
  const handleOpenCheckout = (sofa) => {
    setSelectedSofaForPayment(sofa);
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
    setIsCheckoutOpen(true);
  };

  // Simulate Payment Process & Add to Orders/Cart
  const handleProcessFakePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      
      const newOrder = {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        sofa: selectedSofaForPayment,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: paymentMethod.toUpperCase(),
      };
      
      setCart((prev) => [newOrder, ...prev]);
    }, 2000);
  };

  // Cancel Order Functionality
  const handleCancelOrder = (orderId) => {
    if (window.confirm("Kya aap sach me yeh order cancel karna chahte hain?")) {
      setCart((prev) => prev.filter((item) => item.orderId !== orderId));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-800 selection:text-white">
      
      {/* 1. Header Navbar */}
      <header className="bg-stone-950/90 backdrop-blur-md sticky top-0 z-50 w-full border-b border-stone-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl font-black tracking-tight text-white">
                Sofa<span className="text-amber-500">Craft</span>.
              </span>
            </div>

            <nav className="hidden md:flex space-x-10 font-medium text-stone-300 text-sm tracking-wide">
              <a href="#home" className="hover:text-amber-400 transition">HOME</a>
              <a href="#products" className="hover:text-amber-400 transition">COLLECTION</a>
              <a href="#about" className="hover:text-amber-400 transition">ABOUT</a>
              <a href="#contact" className="hover:text-amber-400 transition">CONTACT</a>
            </nav>

            <div className="flex items-center space-x-6">
              {/* Right Side Cart/Shop Icon with Order Count */}
              <button 
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-stone-300 hover:text-amber-400 transition bg-stone-900 hover:bg-stone-800 rounded-full cursor-pointer relative border border-stone-800"
              >
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-stone-200 font-semibold text-sm">Hello, {user}</span>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="border border-red-500 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-950/50 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-amber-800 transition shadow-md shadow-amber-900/20 cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="home" className="relative text-white min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10 bg-stone-950">
        <div className="absolute inset-0 z-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentBgIndex * 100}%)` }}>
          {backgroundImages.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img src={img} alt="Luxury Sofa Slide" className="w-full h-full object-cover object-center filter brightness-90" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/80"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-20 pt-12 pb-20">
          <span className="text-amber-400 font-semibold text-xs tracking-widest uppercase bg-amber-950/80 px-4 py-2 rounded-full border border-amber-700/60 inline-block mb-6 shadow-md">
            Handcrafted Luxury Living
          </span>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight mb-8 leading-tight">
            Elevate Your Space With <span className="text-amber-400">Timeless</span> Elegance.
          </h1>
          <p className="text-lg sm:text-xl text-stone-200 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Discover bespoke artisan sofas designed for ultimate comfort, built with sustainable materials and unmatched craftsmanship.
          </p>
          <a 
            href="#products" 
            className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-10 py-4.5 rounded-full shadow-xl shadow-amber-900/40 transition duration-300 inline-block cursor-pointer text-base"
          >
            Explore Collection →
          </a>
        </div>
      </section>

      {/* 3. Products Section */}
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
              <div key={sofa.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 border border-stone-100 overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="w-full h-80 bg-stone-100 relative overflow-hidden flex items-center justify-center">
                    {sofa.image ? (
                      <img src={sofa.image} alt={sofa.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" />
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
                    onClick={() => handleOpenCheckout(sofa)}
                    className="bg-stone-950 text-white px-6 py-3 rounded-xl hover:bg-amber-950 transition font-medium text-sm shadow-md cursor-pointer"
                  >
                    Buy / Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. About Section */}
      <section id="about" className="py-24 bg-stone-100 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-950 mb-8 tracking-tight">Crafted For Generations</h2>
          <p className="text-stone-700 text-xl leading-relaxed mb-12 font-light">
            At SofaCraft, we believe furniture shouldn't just fill a room—it should tell a story.
          </p>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-10 sm:p-16 shadow-lg border border-stone-200">
          <h2 className="text-4xl font-bold text-stone-950 tracking-tight text-center mb-8">Get In Touch</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }} className="space-y-6">
            <input type="text" placeholder="Your Name" required className="w-full p-4 border rounded-xl" />
            <input type="email" placeholder="Your Email" required className="w-full p-4 border rounded-xl" />
            <textarea placeholder="Message" rows="4" required className="w-full p-4 border rounded-xl"></textarea>
            <button type="submit" className="w-full bg-amber-900 text-white py-4 rounded-xl font-semibold">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 text-center text-sm border-t border-stone-800">
        <p>&copy; {new Date().getFullYear()} SofaCraft. All rights reserved.</p>
      </footer>

      {/* 6. RIGHT SIDE CART / ORDERS SLIDE DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h3 className="text-xl font-bold text-stone-900 flex items-center">
                  🛒 Your Active Orders <span className="ml-2 text-xs bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-full">{cart.length}</span>
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsCartOpen(false)}
                  className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <p className="text-5xl mb-3">🛍️</p>
                  <p className="font-medium text-stone-600">No active orders found.</p>
                  <p className="text-xs mt-1">Buy a sofa using the "Buy / Checkout" button to see it stored here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.orderId} className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 relative shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.sofa.image ? (
                            <img src={item.sofa.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            '🛋️'
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            CONFIRMED • {item.method}
                          </span>
                          <h4 className="font-bold text-stone-900 mt-1">{item.sofa.name || item.sofa.title}</h4>
                          <p className="text-amber-900 font-extrabold text-sm">₹{item.sofa.price}</p>
                          <p className="text-[11px] text-stone-400 mt-0.5">Order ID: {item.orderId}</p>
                        </div>
                      </div>

                      {/* Cancel Order Button */}
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(item.orderId)}
                        className="mt-3 w-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center cursor-pointer"
                      >
                        🚫 Cancel Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition"
                >
                  Close & Continue Browsing
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. FAKE / DEMO PAYMENT GATEWAY MODAL */}
      {isCheckoutOpen && selectedSofaForPayment && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-stone-200">
            
            <button 
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 font-bold text-lg bg-stone-100 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {!paymentSuccess ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Demo Payment Gateway
                </span>
                
                <h3 className="text-2xl font-black text-stone-900 mt-3 mb-1">Complete Order</h3>
                <p className="text-stone-500 text-sm mb-6">Secured 256-bit SSL encrypted checkout</p>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {selectedSofaForPayment.image ? (
                      <img src={selectedSofaForPayment.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      '🛋️'
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900">{selectedSofaForPayment.name || selectedSofaForPayment.title}</h4>
                    <p className="text-amber-900 font-black text-lg">₹{selectedSofaForPayment.price}</p>
                  </div>
                </div>

                <form onSubmit={handleProcessFakePayment} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${paymentMethod === 'card' ? 'border-amber-800 bg-amber-50 text-amber-900' : 'border-stone-200 text-stone-600'}`}
                    >
                      💳 Credit/Debit
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${paymentMethod === 'upi' ? 'border-amber-800 bg-amber-50 text-amber-900' : 'border-stone-200 text-stone-600'}`}
                    >
                      📱 UPI / GPay
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${paymentMethod === 'cod' ? 'border-amber-800 bg-amber-50 text-amber-900' : 'border-stone-200 text-stone-600'}`}
                    >
                      💵 Cash on Delivery
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-3 pt-2">
                      <input type="text" placeholder="Card Number (e.g. 4000 1234 5678 9010)" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none" />
                        <input type="password" placeholder="CVV" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="pt-2">
                      <input type="text" placeholder="Enter UPI ID (e.g. name@okaxis)" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none" />
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      Pay cash when the sofa is delivered to your doorstep.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isProcessingPayment}
                    className="w-full bg-amber-900 hover:bg-amber-950 text-white py-4 rounded-xl font-bold transition shadow-lg cursor-pointer flex items-center justify-center space-x-2 mt-4"
                  >
                    {isProcessingPayment ? (
                      <span>Processing Payment... ⏳</span>
                    ) : (
                      <span>Pay ₹{selectedSofaForPayment.price} Now →</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-stone-900">Payment Successful!</h3>
                <p className="text-stone-600 text-sm mt-2">
                  Order for <span className="font-bold text-stone-900">{selectedSofaForPayment.name || selectedSofaForPayment.title}</span> stored in your Cart/Orders list!
                </p>

                <div className="mt-6 flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 bg-amber-900 text-white py-3 rounded-xl font-bold text-xs hover:bg-amber-950 transition"
                  >
                    View Orders 🛒
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 border border-stone-300 text-stone-700 py-3 rounded-xl font-bold text-xs hover:bg-stone-100 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative">
            <button type="button" onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-stone-400 font-bold">✕</button>
            <h3 className="text-2xl font-bold text-stone-950 mb-4">{isLoginTab ? 'Sign In' : 'Register'}</h3>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input type="email" placeholder="Email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full p-3 border rounded-xl" />
              <input type="password" placeholder="Password" required value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full p-3 border rounded-xl" />
              <button type="submit" className="w-full bg-amber-900 text-white py-3.5 rounded-xl font-bold">
                {isLoginTab ? 'Sign In' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
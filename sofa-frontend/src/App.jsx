import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import About from './components/About';


function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <div id="home"><Hero /></div>
      <ProductList />
      <About />
      <Contact />
    </div>
  );
}

export default App;
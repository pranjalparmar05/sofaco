import React, { useEffect, useState } from 'react';
import { getSofas } from '../services/api';

export default function ProductGrid() {
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSofas()
      .then(data => {
        setSofas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-lg font-medium text-gray-600">Loading luxurious sofas...</div>;
  }

  if (sofas.length === 0) {
    return <div className="text-center py-12 text-gray-500">No sofas available yet. Please add some from the Django Admin panel!</div>;
  }

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Exclusive Sofa Collection</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sofas.map((sofa) => (
          <div key={sofa.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between">
            <div>
              {sofa.image ? (
                <img src={sofa.image} alt={sofa.name} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                  🛋️ No Image Available
                </div>
              )}
              
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  {sofa.tag || 'Bestseller'}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{sofa.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{sofa.description}</p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between mt-4">
              <div>
                <span className="text-2xl font-bold text-amber-900">₹{sofa.price}</span>
                {sofa.original_price && (
                  <span className="text-sm text-gray-400 line-through ml-2">₹{sofa.original_price}</span>
                )}
              </div>
              <button className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition font-medium shadow-sm">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
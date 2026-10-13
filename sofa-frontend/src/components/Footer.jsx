export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-amber-500 mb-4">SofaCraft🛋️</h3>
          <p className="text-sm text-gray-400">
            Crafting elegance and comfort for your living space. Handmade premium sofas delivered across India.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#home" className="hover:text-amber-500 transition">Home</a></li>
            <li><a href="#products" className="hover:text-amber-500 transition">Sofa Collection</a></li>
            <li><a href="#about" className="hover:text-amber-500 transition">About Us</a></li>
            <li><a href="#contact" className="hover:text-amber-500 transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-amber-500 transition">Track Order</a></li>
            <li><a href="#" className="hover:text-amber-500 transition">Warranty & Returns</a></li>
            <li><a href="#" className="hover:text-amber-500 transition">Customization Request</a></li>
            <li><a href="#" className="hover:text-amber-500 transition">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
          <p className="text-sm text-gray-400 mb-2">📍 Mumbai, Maharashtra, India</p>
          <p className="text-sm text-gray-400 mb-2">📞 +91 98765 43210</p>
          <p className="text-sm text-gray-400">✉️ support@sofacraft.com</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-800 pt-6">
        © 2026 SofaCraft E-Commerce Inc. All rights reserved.
      </div>
    </footer>
  );
}
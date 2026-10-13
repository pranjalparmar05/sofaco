export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-amber-800 tracking-wide cursor-pointer">
              SofaCraft🛋️
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 font-medium text-gray-700">
            <a href="#home" className="hover:text-amber-700 transition duration-200">Home</a>
            <a href="#products" className="hover:text-amber-700 transition duration-200">Sofa Collection</a>
            <a href="#about" className="hover:text-amber-700 transition duration-200">About Us</a>
            <a href="#contact" className="hover:text-amber-700 transition duration-200">Contact</a>
          </div>

          {/* Cart & Login */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-700 hover:text-amber-700 transition duration-200">
              🛒
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <button className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition duration-200 font-medium shadow-sm">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
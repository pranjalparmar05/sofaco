export default function HeroSection() {
  return (
    <div className="bg-amber-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Transform Your Living Room with Premium Sofas
          </h1>
          <p className="text-lg text-gray-600">
            Discover modern, comfortable, and handcrafted sofas designed to elevate your home style. Get up to 30% off on new arrivals!
          </p>
          <div className="flex space-x-4">
            <a 
              href="#products" 
              className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-amber-900 transition"
            >
              Shop Collection
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" 
            alt="Modern Luxury Sofa" 
            className="rounded-2xl shadow-xl object-cover w-full max-h-96"
          />
        </div>
      </div>
    </div>
  );
}
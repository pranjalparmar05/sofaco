export default function Hero() {
  return (
    <div id="home" className="relative bg-amber-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center rounded-3xl max-w-7xl mx-auto my-8 overflow-hidden shadow-xl">
      <div className="relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Discover Ultimate Comfort with SofaCraft
        </h1>
        <p className="text-lg text-amber-200 mb-8">
          Handcrafted luxury sofas designed for your living space. Premium quality, modern design, and unmatched comfort.
        </p>
        <a 
          href="#products" 
          className="bg-white text-amber-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-amber-100 transition duration-200"
        >
          Explore Collection
        </a>
      </div>
    </div>
  );
}
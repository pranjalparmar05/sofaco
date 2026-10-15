export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-amber-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-8">Have questions about our sofas or need custom sizing? Drop us a message!</p>
        
        <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input type="text" required className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none" placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea rows="4" required className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-600 outline-none" placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition font-medium shadow-md cursor-pointer">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
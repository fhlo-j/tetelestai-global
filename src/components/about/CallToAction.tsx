
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-20 relative text-white">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
          alt="Nature background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="container-custom text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community of Believers</h2>
          <p className="text-white/90 text-lg mb-8">
            Be part of our growing family at Tetelestai Global and discover your divine purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-gold flex items-center justify-center gap-2">
              Contact Us Today
            </Link>
            <Link to="/events" className="bg-white text-divine hover:bg-gray-100 px-6 py-2.5 rounded-md transition-colors duration-300 flex items-center justify-center gap-2">
              Upcoming Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

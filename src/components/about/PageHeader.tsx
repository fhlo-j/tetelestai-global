
import React from 'react';

const PageHeader = () => {
  return (
    <div className="pt-24 pb-12 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1473177104440-ffee2f376098" 
          alt="Church interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="container-custom text-center relative z-10">
        <h1 className="text-white mb-4">About Tetelestai Global</h1>
        <p className="text-white/90 max-w-2xl mx-auto text-lg">
          Our story, mission, and vision for transforming lives through the power of the Gospel
        </p>
      </div>
    </div>
  );
};

export default PageHeader;

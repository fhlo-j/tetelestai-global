
import React from 'react';

const OurStory = () => {
  return (
    <section className="section-padding celestial-gradient">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-divine mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Tetelestai Global Ministry was founded in 2010 with a divine vision to proclaim 
              the finished work of Christ throughout the nations. What began as a small prayer 
              group of 12 dedicated believers has grown into an international ministry touching 
              thousands of lives across the globe.
            </p>
            <p className="text-gray-700 mb-4">
              The name "Tetelestai" — Jesus' final word on the cross meaning "It is finished" in Greek — 
              serves as the foundation of our ministry. It reminds us that through Christ's sacrifice, 
              God's redemptive plan for humanity was completed.
            </p>
            <p className="text-gray-700">
              Today, our ministry extends across multiple platforms, including in-person gatherings, 
              digital outreach, humanitarian efforts, and discipleship programs, all aimed at helping 
              people experience the transformative power of God's love and grace.
            </p>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1492321936769-b49830bc1d1e" 
              alt="Tetelestai Global Ministry" 
              className="w-full h-auto"
            />
            <div className="absolute top-0 left-0 bg-gold text-black py-2 px-4">
              <span className="font-medium">Est. 2010</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

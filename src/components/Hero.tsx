
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  
  const headingTexts = [
    "Welcome to <span class='text-gold'>Tetelestai</span> Global",
    "Experience God's <span class='text-gold'>Presence</span>",
    "Discover Your <span class='text-gold'>Purpose</span>",
    "Embrace His <span class='text-gold'>Finished</span> Work"
  ];
  
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % headingTexts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Video background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        >
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="container-custom relative z-20 pt-20 pb-20 md:pt-24 md:pb-24">
        <div className={`max-w-3xl ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
          <motion.h1 
            key={textIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6"
            dangerouslySetInnerHTML={{ __html: headingTexts[textIndex] }}
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-xl"
          >
            Embrace the divine journey of faith, hope, and love as we connect hearts to God's eternal purpose. It is finished!
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/sermons" className="btn-primary flex items-center justify-center gap-2 group">
              <Play size={18} />
              <span>Watch Sermons</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/events" className="btn-secondary flex items-center justify-center gap-2">
              <Calendar size={18} />
              <span>Upcoming Events</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;


import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-divine text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Ministry Info */}
          <div>
            <Link to="/" className="flex items-center gap-1">
              <h3 className="text-2xl font-bold text-white">Tetelestai</h3>
              <span className="text-gold font-heading text-lg">Global</span>
            </Link>
            <p className="mt-4 text-white/80">
              Embracing God's eternal purpose through faith, hope, and love. Serving the nations through the power of the Gospel.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" aria-label="Facebook" className="text-white/80 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="text-white/80 hover:text-gold transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/80 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/80 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/80 hover:text-gold transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/sermons" className="text-white/80 hover:text-gold transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  Sermons
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/80 hover:text-gold transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  Events
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-gold transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-gold transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-1" />
                <span className="text-white/80">123 Faith Street, Holy City, 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gold" />
                <a href="tel:+1234567890" className="text-white/80 hover:text-gold transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gold" />
                <a href="mailto:info@tetelestaiglobal.org" className="text-white/80 hover:text-gold transition-colors">
                  info@tetelestaiglobal.org
                </a>
              </div>
            </div>
          </div>
          
          {/* Service Times */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Service Times</h4>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Sunday Service</p>
                <p className="text-white/80">9:00 AM - 12:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Bible Study</p>
                <p className="text-white/80">Wednesday, 6:00 PM - 8:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Prayer Meeting</p>
                <p className="text-white/80">Friday, 7:00 PM - 8:30 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/70 text-sm">
          <p>&copy; {currentYear} Tetelestai Global Ministry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

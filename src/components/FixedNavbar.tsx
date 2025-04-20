
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import GiveModal from './GiveModal';

const FixedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'py-5'
      }`}
      style={{
        backgroundImage: !scrolled ? 'url(https://images.unsplash.com/photo-1491566102020-21838225c3c8?q=80&w=2070&auto=format&fit=crop)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={`absolute inset-0 ${scrolled ? 'hidden' : 'bg-black/60'}`}></div>
      <div className="container-custom flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-heading text-2xl font-bold ${scrolled ? 'text-divine' : 'text-white'}`}>Tetelestai</span>
          <span className="text-gold font-heading text-lg">Global</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink to="/" isActive={isActiveRoute('/')} scrolled={scrolled}>
            Home
          </NavLink>
          <NavLink to="/about" isActive={isActiveRoute('/about')} scrolled={scrolled}>
            About
          </NavLink>
          <NavLink to="/sermons" isActive={isActiveRoute('/sermons')} scrolled={scrolled}>
            Sermons
          </NavLink>
          <NavLink to="/events" isActive={isActiveRoute('/events')} scrolled={scrolled}>
            Events
          </NavLink>
          <NavLink to="/gallery" isActive={isActiveRoute('/gallery')} scrolled={scrolled}>
            Gallery
          </NavLink>
          <NavLink to="/blog" isActive={isActiveRoute('/blog')} scrolled={scrolled}>
            Blog
          </NavLink>
          <NavLink to="/service-times" isActive={isActiveRoute('/service-times')} scrolled={scrolled}>
            Services
          </NavLink>
          <NavLink to="/contact" isActive={isActiveRoute('/contact')} scrolled={scrolled}>
            Contact
          </NavLink>
          <GiveModal />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden ${scrolled ? 'text-divine' : 'text-white'} hover:text-divine-dark transition-colors`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden pt-20 px-6 z-40`}
      >
        <div className="flex flex-col space-y-4">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
          <MobileNavLink to="/sermons" onClick={() => setIsOpen(false)}>Sermons</MobileNavLink>
          <MobileNavLink to="/events" onClick={() => setIsOpen(false)}>Events</MobileNavLink>
          <MobileNavLink to="/gallery" onClick={() => setIsOpen(false)}>Gallery</MobileNavLink>
          <MobileNavLink to="/blog" onClick={() => setIsOpen(false)}>Blog</MobileNavLink>
          <MobileNavLink to="/service-times" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
          <div className="mt-4">
            <GiveModal />
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  scrolled: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, scrolled, children }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`
        nav-item relative px-3 py-2 rounded-md transition-all
        ${scrolled 
          ? 'text-gray-800 hover:text-divine hover:bg-gray-100' 
          : 'text-white hover:text-gold hover:bg-white/10'
        }
        ${isActive && scrolled ? 'text-divine font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-divine' : ''}
        ${isActive && !scrolled ? 'text-gold font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gold' : ''}
      `}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, onClick, children }: MobileNavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`text-lg font-medium py-2 block border-l-4 pl-3 ${
        isActive 
          ? 'border-divine text-divine bg-divine/5' 
          : 'border-transparent text-gray-800 hover:text-divine hover:bg-gray-50'
      }`} 
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default FixedNavbar;

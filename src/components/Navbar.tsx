import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import GiveModal from "./GiveModal";

const Navbar = () => {
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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
        scrolled
          ? "bg-white shadow-md py-3"
          : "py-5 bg-black/10 backdrop-blur-sm"
      }`}
    >
      <div className="container-custom flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dhgtx9k3d/image/upload/v1745539782/tetelestai_logo_1_vybw1t.jpg"
            alt="Logo"
            className="h-10"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/about")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/sermons"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/sermons")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Sermons
          </Link>
          <Link
            to="/events"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/events")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Events
          </Link>
          <Link
            to="/gallery"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/gallery")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Gallery
          </Link>
          <Link
            to="/blog"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/blog")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Blog
          </Link>
          <Link
            to="/service-times"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/service-times")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
              scrolled
                ? "text-gray-800 hover:text-divine"
                : "text-white hover:text-gold-light"
            } ${
              isActiveRoute("/contact")
                ? scrolled
                  ? "text-divine font-medium"
                  : "text-gold-light font-medium"
                : ""
            }`}
          >
            Contact
          </Link>
          <GiveModal />
        </div>

        {/* Mobile menu button - fixed position */}
        <button
          onClick={toggleMenu}
          className={`md:hidden fixed right-6 z-[60] ${
            scrolled ? "text-divine" : isOpen ? "text-gray-800" : "text-white"
          } hover:text-divine-dark transition-colors`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu - updated with centered links and solid background */}
      <div
        className={`fixed inset-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-50 pt-24`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Link
            to="/"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/about") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/sermons"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/sermons") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Sermons
          </Link>
          <Link
            to="/events"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/events") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>
          <Link
            to="/gallery"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/gallery") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Gallery
          </Link>
          <Link
            to="/blog"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/blog") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/service-times"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/service-times") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className={`text-xl font-medium w-full text-center py-3 ${
              isActiveRoute("/contact") ? "text-divine" : "text-gray-800"
            } hover:text-divine`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <div className="mt-8 w-full flex justify-center">
            <GiveModal />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

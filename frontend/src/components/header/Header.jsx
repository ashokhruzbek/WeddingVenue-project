import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DiamondIcon from '@mui/icons-material/Diamond';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] rounded-full flex items-center justify-center 
                          transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-[#1E3A5F]/20">
              <DiamondIcon className="text-[#D4AF37]" sx={{ fontSize: 24 }} />
            </div>
            <span
              className="text-xl font-semibold tracking-wide text-[#1E3A5F] group-hover:text-[#D4AF37] transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Wedding<span className="text-[#D4AF37]">Venue</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] group ${
                isActive("/") ? "text-[#D4AF37]" : "text-[#1E3A5F]"
              }`}
            >
              <HomeIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 transition-transform" />
              Bosh sahifa
            </Link>
            <Link
              to="/home"
              className={`flex items-center gap-2 text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] group ${
                isActive("/home") ? "text-[#D4AF37]" : "text-[#1E3A5F]"
              }`}
            >
              <LocationCityIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 transition-transform" />
              To'yxonalar
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium tracking-wide text-[#1E3A5F] hover:text-[#D4AF37] transition-all duration-300 group"
            >
              <LoginIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 transition-transform" />
              Kirish
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] text-white px-6 py-2.5 rounded-full text-sm font-medium tracking-wide 
                       hover:from-[#c49a2c] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:scale-105"
            >
              <PersonAddIcon sx={{ fontSize: 18 }} />
              Ro'yxatdan o'tish
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1E3A5F] hover:bg-gray-100 transition-all duration-300 hover:scale-110"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 animate-fadeIn">
            <div className="p-6 space-y-2">
              <Link
                to="/"
                className={`flex items-center gap-3 py-3 px-4 font-medium rounded-xl transition-all duration-300 ${
                  isActive("/") ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-[#1E3A5F] hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon sx={{ fontSize: 20 }} />
                Bosh sahifa
              </Link>
              <Link
                to="/home"
                className={`flex items-center gap-3 py-3 px-4 font-medium rounded-xl transition-all duration-300 ${
                  isActive("/home") ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-[#1E3A5F] hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LocationCityIcon sx={{ fontSize: 20 }} />
                To'yxonalar
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-3 py-3 px-4 text-[#1E3A5F] font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LoginIcon sx={{ fontSize: 20 }} />
                Kirish
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] text-white py-3 px-4 rounded-xl font-medium mt-2 hover:from-[#c49a2c] hover:to-[#D4AF37] transition-all duration-300 shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PersonAddIcon sx={{ fontSize: 20 }} />
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

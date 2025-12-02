import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Crown } from "lucide-react";

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
            <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span
              className="text-xl font-semibold tracking-wide text-[#1E3A5F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Wedding<span className="text-[#D4AF37]">Venue</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                isActive("/") ? "text-[#D4AF37]" : "text-[#1E3A5F]"
              }`}
            >
              Bosh sahifa
            </Link>
            <Link
              to="/home"
              className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                isActive("/home") ? "text-[#D4AF37]" : "text-[#1E3A5F]"
              }`}
            >
              To'yxonalar
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium tracking-wide text-[#1E3A5F] hover:text-[#D4AF37] transition-all duration-300"
            >
              Kirish
            </Link>
            <Link
              to="/signup"
              className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-full text-sm font-medium tracking-wide 
                       hover:bg-[#c49a2c] transition-all duration-300 shadow-lg shadow-[#D4AF37]/25"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1E3A5F] hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-2xl border-t">
            <div className="p-6 space-y-4">
              <Link
                to="/"
                className={`block py-3 font-medium border-b border-gray-100 ${
                  isActive("/") ? "text-[#D4AF37]" : "text-[#1E3A5F]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Bosh sahifa
              </Link>
              <Link
                to="/home"
                className={`block py-3 font-medium border-b border-gray-100 ${
                  isActive("/home") ? "text-[#D4AF37]" : "text-[#1E3A5F]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                To'yxonalar
              </Link>
              <Link
                to="/login"
                className="block py-3 text-[#1E3A5F] font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kirish
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center bg-[#D4AF37] text-white py-3 rounded-full font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
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

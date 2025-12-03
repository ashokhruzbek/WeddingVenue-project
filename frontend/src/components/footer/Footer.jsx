import { Link } from "react-router-dom";
import { Phone, Mail, ArrowRight, Zap, Users } from "lucide-react";
import DiamondIcon from '@mui/icons-material/Diamond';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarRateIcon from '@mui/icons-material/StarRate';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] pt-16 pb-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Footer Top */}
        <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#c49a2c] rounded-full flex items-center justify-center 
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <DiamondIcon className="text-white" sx={{ fontSize: 24 }} />
              </div>
              <span
                className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Wedding<span className="text-[#D4AF37]">Venue</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              O'zbekistonning eng yaxshi to'yxona xizmati. Sizning maxsus
              kuningizni unutilmas qilish bizning vazifamiz.
            </p>
            <div className="flex gap-3">
              {[FavoriteIcon, StarRateIcon, CelebrationIcon].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center 
                                      hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-pointer">
                  <Icon sx={{ fontSize: 20, color: '#D4AF37' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Zap size={18} className="text-[#D4AF37]" />
              Havolalar
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  <HomeIcon sx={{ fontSize: 16 }} />
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link
                  to="/home"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  <LocationCityIcon sx={{ fontSize: 16 }} />
                  To'yxonalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Users size={18} className="text-[#D4AF37]" />
              Akkaunt
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  <LoginIcon sx={{ fontSize: 16 }} />
                  Kirish
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  <PersonAddIcon sx={{ fontSize: 16 }} />
                  Ro'yxatdan o'tish
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Phone size={18} className="text-[#D4AF37]" />
              Aloqa
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+998901234567"
                  className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center 
                                group-hover:bg-white/20 transition-colors">
                    <Phone size={14} />
                  </div>
                  +998 90 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@weddingvenue.uz"
                  className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center 
                                group-hover:bg-white/20 transition-colors">
                    <Mail size={14} />
                  </div>
                  info@weddingvenue.uz
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-white/60 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <LocationOnIcon sx={{ fontSize: 16 }} />
                  </div>
                  Toshkent, O'zbekiston
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm flex items-center gap-2">
            <FavoriteIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
            © 2024 WeddingVenue. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm"
            >
              Maxfiylik siyosati
            </a>
            <a
              href="#"
              className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm"
            >
              Foydalanish shartlari
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

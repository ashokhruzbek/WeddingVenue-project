import { Link } from "react-router-dom";
import { Crown, Phone, Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#1E3A5F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Footer Top */}
        <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Wedding<span className="text-[#D4AF37]">Venue</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              O'zbekistonning eng yaxshi to'yxona xizmati. Sizning maxsus
              kuningizni unutilmas qilish bizning vazifamiz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6">Havolalar</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link
                  to="/home"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  To'yxonalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-medium mb-6">Akkaunt</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  Kirish
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  Ro'yxatdan o'tish
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-6">Aloqa</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+998901234567"
                  className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +998 90 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@weddingvenue.uz"
                  className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  info@weddingvenue.uz
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4" />
                  Toshkent, O'zbekiston
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
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

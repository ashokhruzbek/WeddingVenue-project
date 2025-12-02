import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  Menu, 
  X, 
  Crown,
  Users,
  Star,
  Calendar,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Heart,
  Sparkles,
  Shield,
  Clock,
  ChevronUp,
  Quote,
  CheckCircle2
} from "lucide-react"

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 600)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const stats = [
    { number: "150+", label: "Premium To'yxonalar", icon: Crown },
    { number: "10,000+", label: "Baxtli Juftliklar", icon: Heart },
    { number: "4.9", label: "O'rtacha Reyting", icon: Star },
    { number: "15+", label: "Yillik Tajriba", icon: Calendar },
  ]

  const services = [
    {
      icon: Crown,
      title: "Premium To'yxonalar",
      description: "Eng hashamatli va zamonaviy to'yxonalarni o'z ichiga olgan keng katalog",
      features: ["Verified venues", "Virtual tours", "Real photos"]
    },
    {
      icon: Calendar,
      title: "Oson Bron Qilish",
      description: "Bir necha daqiqada o'zingizga yoqqan to'yxonani band qiling",
      features: ["Online booking", "Instant confirmation", "Flexible dates"]
    },
    {
      icon: Shield,
      title: "Ishonchli Xizmat",
      description: "100% xavfsiz to'lov va kafolatlangan xizmat sifati",
      features: ["Secure payments", "Money-back guarantee", "24/7 support"]
    }
  ]

  const testimonials = [
    {
      name: "Aziza & Jasur",
      date: "Noyabr 2024",
      text: "WeddingVenue orqali to'yxona topish juda oson bo'ldi. Xizmat sifati a'lo darajada!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Nilufar & Sardor",
      date: "Oktyabr 2024", 
      text: "Eng yaxshi tanlov qildik. To'yxona juda chiroyli va xizmat mukammal edi.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Madina & Bobur",
      date: "Sentyabr 2024",
      text: "Professional yondashuv va yuqori sifat. Hammaga tavsiya qilamiz!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=100&h=100&fit=crop&crop=faces"
    }
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Elegant Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-[#1E3A5F]' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Crown className={`w-5 h-5 ${scrolled ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`} />
              </div>
              <div>
                <span className={`text-xl font-semibold tracking-wide transition-colors duration-300 ${
                  scrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wedding<span className="text-[#D4AF37]">Venue</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <Link 
                to="/" 
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                  scrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`}
              >
                Bosh sahifa
              </Link>
              <Link 
                to="/home" 
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                  scrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`}
              >
                To'yxonalar
              </Link>
              <a 
                href="#services" 
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                  scrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`}
              >
                Xizmatlar
              </a>
              <a 
                href="#testimonials" 
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                  scrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`}
              >
                Fikrlar
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link 
                to="/login" 
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#D4AF37] ${
                  scrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`}
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
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-[#1E3A5F]' : 'text-white'
              }`}
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
                  className="block py-3 text-[#1E3A5F] font-medium border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bosh sahifa
                </Link>
                <Link 
                  to="/home" 
                  className="block py-3 text-[#1E3A5F] font-medium border-b border-gray-100"
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
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80"
            alt="Wedding venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/90 via-[#1E3A5F]/70 to-[#1E3A5F]/50"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white/90 text-sm font-medium tracking-wide">Premium To'yxona Xizmati</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Orzuyingizdagi <br/>
            <span className="text-[#D4AF37]">To'y Marosimi</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            O'zbekistonning eng hashamatli to'yxonalarini kashf eting. 
            Biz sizning maxsus kuningizni unutilmas qilishga yordam beramiz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/home"
              className="group inline-flex items-center gap-3 bg-[#D4AF37] text-white px-8 py-4 rounded-full 
                       font-medium text-lg hover:bg-[#c49a2c] transition-all duration-300 
                       shadow-xl shadow-[#D4AF37]/30"
            >
              To'yxonalarni ko'rish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 
                       rounded-full font-medium text-lg border border-white/30 
                       hover:bg-white/20 transition-all duration-300"
            >
              Bepul Ro'yxatdan o'tish
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">100% Xavfsiz</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">Tasdiqlangan To'yxonalar</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">24/7 Qo'llab-quvvatlash</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1E3A5F]/5 flex items-center justify-center
                              group-hover:bg-[#1E3A5F] transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-[#D4AF37] group-hover:text-[#D4AF37]" />
                </div>
                <div className="text-3xl md:text-4xl font-semibold text-[#1E3A5F] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.number}
                </div>
                <div className="text-gray-500 text-sm tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Bizning Xizmatlarimiz</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1E3A5F] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nima uchun <span className="text-[#D4AF37]">WeddingVenue</span>?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Biz sizga eng yaxshi xizmatni taqdim etish uchun har bir tafsilotga e'tibor beramiz
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100
                          hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/20 
                          transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] 
                              flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-xl font-semibold text-[#1E3A5F] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Mijozlar Fikrlari</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Baxtli <span className="text-[#D4AF37]">Juftliklar</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Minglab oilalar bizga ishonib, unutilmas to'y marosimlarini o'tkazishdi
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10
                          hover:bg-white/10 transition-all duration-300"
              >
                <Quote className="w-10 h-10 text-[#D4AF37]/50 mb-4" />
                
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                  />
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-white/50 text-sm">{testimonial.date}</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E3A5F]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-6">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-medium">Hoziroq Boshlang</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1E3A5F] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Orzuyingizdagi to'yxonani <br/>
            <span className="text-[#D4AF37]">bugun toping</span>
          </h2>
          
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            10,000+ baxtli juftliklarga qo'shiling va o'zingizning maxsus kuningizni 
            eng yaxshi to'yxonada nishonlang
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/home"
              className="group inline-flex items-center justify-center gap-3 bg-[#1E3A5F] text-white 
                       px-8 py-4 rounded-full font-medium text-lg hover:bg-[#2d4a6f] 
                       transition-all duration-300 shadow-xl shadow-[#1E3A5F]/20"
            >
              To'yxonalarni ko'rish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-white 
                       px-8 py-4 rounded-full font-medium text-lg hover:bg-[#c49a2c] 
                       transition-all duration-300 shadow-xl shadow-[#D4AF37]/20"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
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
                <span className="text-xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wedding<span className="text-[#D4AF37]">Venue</span>
                </span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed">
                O'zbekistonning eng yaxshi to'yxona xizmati. 
                Sizning maxsus kuningizni unutilmas qilish bizning vazifamiz.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-medium mb-6">Havolalar</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                    Bosh sahifa
                  </Link>
                </li>
                <li>
                  <Link to="/home" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                    To'yxonalar
                  </Link>
                </li>
                <li>
                  <a href="#services" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                    Xizmatlar
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                    Fikrlar
                  </a>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-white font-medium mb-6">Akkaunt</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/login" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                    Kirish
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
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
                  <a href="tel:+998901234567" className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    +998 90 123 45 67
                  </a>
                </li>
                <li>
                  <a href="mailto:info@weddingvenue.uz" className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
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
              <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">
                Maxfiylik siyosati
              </a>
              <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">
                Foydalanish shartlari
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#D4AF37] text-white p-4 rounded-full 
                   shadow-lg shadow-[#D4AF37]/30 hover:bg-[#c49a2c] transition-all duration-300 z-50"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  )
}

export default Landing

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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
  CheckCircle2,
  Search,
  Award,
  Zap
} from "lucide-react"

// MUI Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CelebrationIcon from '@mui/icons-material/Celebration';
import DiamondIcon from '@mui/icons-material/Diamond';
import SecurityIcon from '@mui/icons-material/Security';
import StarRateIcon from '@mui/icons-material/StarRate';
import GroupsIcon from '@mui/icons-material/Groups';

gsap.registerPlugin(ScrollTrigger)

function LandingEnhanced() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Refs for animations
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 600)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Hero Animation
    const heroTimeline = gsap.timeline()
    heroTimeline
      .from(".hero-badge", { 
        opacity: 0, 
        y: -20, 
        duration: 0.8, 
        ease: "power3.out" 
      })
      .from(".hero-title", { 
        opacity: 0, 
        y: 40, 
        duration: 1, 
        ease: "power3.out" 
      }, "-=0.3")
      .from(".hero-subtitle", { 
        opacity: 0, 
        y: 30, 
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.5")
      .from(".hero-buttons", { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.4")
      .from(".hero-badges", { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        ease: "power3.out",
        stagger: 0.1
      }, "-=0.3")

    // Floating animation for decorative elements
    gsap.to(".floating-decoration", {
      y: -20,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    })

    // Stats Animation
    gsap.from(".stat-card", {
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    })

    // Services Animation
    gsap.from(".service-card", {
      scrollTrigger: {
        trigger: servicesRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    })

    // Testimonials Animation
    gsap.from(".testimonial-card", {
      scrollTrigger: {
        trigger: testimonialsRef.current,
        start: "top 80%",
      },
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)"
    })

    // CTA Animation
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const stats = [
    { number: "150+", label: "Premium To'yxonalar", Icon: DiamondIcon, color: "#D4AF37" },
    { number: "10,000+", label: "Baxtli Juftliklar", Icon: FavoriteIcon, color: "#EF4444" },
    { number: "4.9", label: "O'rtacha Reyting", Icon: StarRateIcon, color: "#F59E0B" },
    { number: "15+", label: "Yillik Tajriba", Icon: CalendarTodayIcon, color: "#3B82F6" },
  ]

  const services = [
    {
      Icon: DiamondIcon,
      title: "Premium To'yxonalar",
      description: "Eng hashamatli va zamonaviy to'yxonalarni o'z ichiga olgan keng katalog",
      features: ["Tasdiqlangan to'yxonalar", "Virtual turlar", "Haqiqiy fotosuratlar"],
      color: "#D4AF37"
    },
    {
      Icon: CalendarTodayIcon,
      title: "Oson Bron Qilish",
      description: "Bir necha daqiqada o'zingizga yoqqan to'yxonani band qiling",
      features: ["Onlayn bron", "Tezkor tasdiqlash", "Moslashuvchan sanalar"],
      color: "#3B82F6"
    },
    {
      Icon: SecurityIcon,
      title: "Ishonchli Xizmat",
      description: "100% xavfsiz to'lov va kafolatlangan xizmat sifati",
      features: ["Xavfsiz to'lovlar", "Pul qaytarish kafolati", "24/7 qo'llab-quvvatlash"],
      color: "#10B981"
    }
  ]

  const testimonials = [
    {
      name: "Aziza & Jasur",
      date: "Noyabr 2024",
      text: "WeddingVenue orqali to'yxona topish juda oson bo'ldi. Xizmat sifati a'lo darajada! Har bir tafsilotga e'tibor berildi va biz juda mamnunmiz.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Nilufar & Sardor",
      date: "Oktyabr 2024", 
      text: "Eng yaxshi tanlov qildik. To'yxona juda chiroyli va xizmat mukammal edi. Mehmonlarimiz hali ham to'y haqida gap ochishadi!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Madina & Bobur",
      date: "Sentyabr 2024",
      text: "Professional yondashuv va yuqori sifat. Hammaga tavsiya qilamiz! Bizning hayotimizdagi eng go'zal kunni unutilmas qildi.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=100&h=100&fit=crop&crop=faces"
    }
  ]

  const features = [
    { Icon: VerifiedIcon, text: "100% Tasdiqlangan", color: "#10B981" },
    { Icon: LocalAtmIcon, text: "Eng yaxshi narxlar", color: "#D4AF37" },
    { Icon: SupportAgentIcon, text: "24/7 Yordam", color: "#3B82F6" },
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
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-[#1E3A5F]' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <DiamondIcon className={`text-[#D4AF37]`} sx={{ fontSize: 24 }} />
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
                         hover:bg-[#c49a2c] transition-all duration-300 shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/30 hover:scale-105"
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

      {/* Hero Section with Enhanced Animations */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80"
            alt="Wedding venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/90 via-[#1E3A5F]/70 to-[#1E3A5F]/50"></div>
        </div>

        {/* Animated Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl floating-decoration"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl floating-decoration" style={{ animationDelay: '1s' }}></div>
        
        {/* Sparkle Effects */}
        <div className="absolute top-1/4 right-1/4">
          <AutoAwesomeIcon className="text-[#D4AF37]/30 animate-pulse" sx={{ fontSize: 40 }} />
        </div>
        <div className="absolute bottom-1/3 left-1/4">
          <CelebrationIcon className="text-[#D4AF37]/20 animate-pulse" sx={{ fontSize: 32 }} style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8">
            <AutoAwesomeIcon className="text-[#D4AF37]" sx={{ fontSize: 18 }} />
            <span className="text-white/90 text-sm font-medium tracking-wide">Premium To'yxona Xizmati</span>
          </div>
          
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6" 
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Orzuyingizdagi <br/>
            <span className="text-[#D4AF37] inline-flex items-center gap-3">
              To'y Marosimi
              <FavoriteIcon className="inline animate-pulse" sx={{ fontSize: { xs: 40, md: 60, lg: 70 } }} />
            </span>
          </h1>
          
          <p className="hero-subtitle text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            O'zbekistonning eng hashamatli to'yxonalarini kashf eting. 
            Biz sizning maxsus kuningizni unutilmas qilishga yordam beramiz.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/home"
              className="group inline-flex items-center gap-3 bg-[#D4AF37] text-white px-8 py-4 rounded-full 
                       font-medium text-lg hover:bg-[#c49a2c] transition-all duration-300 
                       shadow-xl shadow-[#D4AF37]/30 hover:shadow-2xl hover:shadow-[#D4AF37]/40 hover:scale-105"
            >
              <Search size={20} />
              To'yxonalarni ko'rish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 
                       rounded-full font-medium text-lg border-2 border-white/30 
                       hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <GroupsIcon sx={{ fontSize: 22 }} />
              Bepul Ro'yxatdan o'tish
            </Link>
          </div>

          {/* Enhanced Trust Badges */}
          <div className="hero-badges mt-16 flex flex-wrap justify-center items-center gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                  <feature.Icon sx={{ fontSize: 20, color: feature.color }} />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section with Animations */}
      <section ref={statsRef} className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card text-center group cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#1E3A5F]/5 to-[#D4AF37]/5 
                              flex items-center justify-center group-hover:scale-110 transition-all duration-300 
                              shadow-lg shadow-gray-100">
                  <stat.Icon sx={{ fontSize: 36, color: stat.color }} />
                </div>
                <div className="text-4xl md:text-5xl font-semibold text-[#1E3A5F] mb-2 group-hover:text-[#D4AF37] transition-colors" 
                     style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm tracking-wide font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Enhanced Cards */}
      <section ref={servicesRef} id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-6">
              <AutoAwesomeIcon className="text-[#D4AF37]" sx={{ fontSize: 18 }} />
              <span className="text-[#D4AF37] text-sm font-medium">Bizning Xizmatlarimiz</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1E3A5F] mb-6" 
                style={{ fontFamily: "'Playfair Display', serif" }}>
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
                className="service-card group bg-white rounded-3xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100
                          hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/20 hover:-translate-y-2
                          transition-all duration-500 cursor-pointer"
              >
                <div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] 
                            flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 
                            transition-all duration-300 shadow-lg"
                  style={{ boxShadow: `0 10px 30px ${service.color}30` }}
                >
                  <service.Icon sx={{ fontSize: 28, color: '#D4AF37' }} />
                </div>
                
                <h3 className="text-xl font-semibold text-[#1E3A5F] mb-3 group-hover:text-[#D4AF37] transition-colors" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <VerifiedIcon sx={{ fontSize: 18, color: service.color }} />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Enhanced Design */}
      <section ref={testimonialsRef} id="testimonials" className="py-24 bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <FavoriteIcon className="text-[#D4AF37]" sx={{ fontSize: 18 }} />
              <span className="text-[#D4AF37] text-sm font-medium">Mijozlar Fikrlari</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6" 
                style={{ fontFamily: "'Playfair Display', serif" }}>
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
                className="testimonial-card bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20
                          hover:bg-white/15 hover:border-[#D4AF37]/30 hover:scale-105 
                          transition-all duration-500 cursor-pointer group"
              >
                <Quote className="w-12 h-12 text-[#D4AF37]/50 mb-4 group-hover:text-[#D4AF37] transition-colors" />
                
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] 
                             group-hover:border-[#e5c866] transition-colors"
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/50 text-sm">{testimonial.date}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarRateIcon key={i} sx={{ fontSize: 20, color: '#D4AF37' }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section ref={ctaRef} className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E3A5F]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <CelebrationIcon sx={{ fontSize: 200, color: '#F5F1E8' }} className="animate-pulse" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center cta-content">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-6">
            <DiamondIcon className="text-[#D4AF37]" sx={{ fontSize: 18 }} />
            <span className="text-[#D4AF37] text-sm font-medium">Hoziroq Boshlang</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1E3A5F] mb-6" 
              style={{ fontFamily: "'Playfair Display', serif" }}>
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
                       transition-all duration-300 shadow-xl shadow-[#1E3A5F]/20 hover:shadow-2xl hover:scale-105"
            >
              <Search size={20} />
              To'yxonalarni ko'rish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-white 
                       px-8 py-4 rounded-full font-medium text-lg hover:bg-[#c49a2c] 
                       transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:scale-105"
            >
              <GroupsIcon sx={{ fontSize: 22 }} />
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] pt-16 pb-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Footer Top */}
          <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center 
                              group-hover:scale-110 transition-transform duration-300">
                  <DiamondIcon className="text-white" sx={{ fontSize: 24 }} />
                </div>
                <span className="text-xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wedding<span className="text-[#D4AF37]">Venue</span>
                </span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed">
                O'zbekistonning eng yaxshi to'yxona xizmati. 
                Sizning maxsus kuningizni unutilmas qilish bizning vazifamiz.
              </p>
              <div className="mt-6 flex gap-3">
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
                  <Link to="/" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    Bosh sahifa
                  </Link>
                </li>
                <li>
                  <Link to="/home" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    To'yxonalar
                  </Link>
                </li>
                <li>
                  <a href="#services" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    Xizmatlar
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    Fikrlar
                  </a>
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
                  <Link to="/login" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    Kirish
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                  <a href="tel:+998901234567" 
                     className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm group">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center 
                                  group-hover:bg-white/20 transition-colors">
                      <Phone size={14} />
                    </div>
                    +998 90 123 45 67
                  </a>
                </li>
                <li>
                  <a href="mailto:info@weddingvenue.uz" 
                     className="flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm group">
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

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-[#D4AF37] to-[#c49a2c] text-white p-4 rounded-full 
                   shadow-xl shadow-[#D4AF37]/40 hover:shadow-2xl hover:scale-110 transition-all duration-300 z-50 group"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  )
}

export default LandingEnhanced

"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  ArrowRight, 
  Crown, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Menu,
  X
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".floating-decor", {
        y: -20,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      });

      gsap.fromTo(formRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      gsap.to(".gradient-bg", {
        backgroundPosition: "100% 100%",
        duration: 10,
        ease: "none",
        repeat: -1,
        yoyo: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const decoded = jwtDecode(data.token);
      const role = decoded.role;

      navigate(`/${role}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setError("Server bilan aloqa yo'q. Qayta urinib ko'ring.");
      } else {
        setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="text-xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Wedding<span className="text-[#D4AF37]">Venue</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/" className="text-sm font-medium text-[#1E3A5F] hover:text-[#D4AF37] transition-colors">
                Bosh sahifa
              </Link>
              <Link to="/home" className="text-sm font-medium text-[#1E3A5F] hover:text-[#D4AF37] transition-colors">
                To'yxonalar
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-[#D4AF37]">
                Kirish
              </Link>
              <Link to="/signup" className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#c49a2c] transition-colors">
                Ro'yxatdan o'tish
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-[#1E3A5F]">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t p-4 space-y-3">
              <Link to="/" className="block py-2 text-[#1E3A5F] font-medium" onClick={() => setMobileMenuOpen(false)}>Bosh sahifa</Link>
              <Link to="/home" className="block py-2 text-[#1E3A5F] font-medium" onClick={() => setMobileMenuOpen(false)}>To'yxonalar</Link>
              <Link to="/signup" className="block text-center bg-[#D4AF37] text-white py-2.5 rounded-full font-medium" onClick={() => setMobileMenuOpen(false)}>Ro'yxatdan o'tish</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 h-screen flex">
        {/* Left Side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A5F] relative overflow-hidden">
          <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#2d4a6f] to-[#1E3A5F] bg-[length:200%_200%]"></div>
          
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl floating-decor"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl floating-decor"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Xush kelibsiz!
              </h1>
              
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                O'zbekistonning eng hashamatli to'yxonalarini kashf eting va orzuingizdagi to'yni rejalashtiring
              </p>

              <div className="mt-10 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">150+</div>
                  <div className="text-white/60 text-sm">To'yxonalar</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">10K+</div>
                  <div className="text-white/60 text-sm">Mijozlar</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">4.9</div>
                  <div className="text-white/60 text-sm">Reyting</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
          <div ref={formRef} className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-14 h-14 bg-[#1E3A5F] rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h1 className="text-xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Xush kelibsiz!
              </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full mb-3">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-sm font-medium">Tizimga kirish</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Hisobingizga kiring
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  To'yxonalarni ko'rish va band qilish uchun
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">
                    Foydalanuvchi nomi
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none text-gray-700"
                      placeholder="Foydalanuvchi nomini kiriting"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">
                    Parol
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none text-gray-700"
                      placeholder="Parolni kiriting"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#D4AF37] hover:bg-[#c49a2c] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/25 disabled:opacity-70 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Kirish...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirish</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm">yoki</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Hisobingiz yo'qmi?{" "}
                  <Link to="/signup" className="text-[#D4AF37] hover:text-[#c49a2c] font-medium">
                    Ro'yxatdan o'tish
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  ArrowRight,
  Crown,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Menu,
  X,
  UserCheck
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: "user",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "Ism kiritilishi shart";
    if (!formData.lastname.trim()) newErrors.lastname = "Familiya kiritilishi shart";
    if (!formData.username.trim()) newErrors.username = "Foydalanuvchi nomi kiritilishi shart";
    if (formData.password.length < 4) newErrors.password = "Parol kamida 4 ta belgidan iborat bo'lishi kerak";
    if (formData.password !== confirmPassword) newErrors.confirmPassword = "Parollar mos kelmadi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post("/api/auth/signup", formData);
      setSubmitStatus("success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      setSubmitStatus("error");
      if (error.response?.data?.message) {
        setErrors((prev) => ({ ...prev, server: error.response.data.message }));
      } else {
        setErrors((prev) => ({ ...prev, server: "Ro'yxatdan o'tishda xatolik yuz berdi." }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName) => `w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm ${
    errors[fieldName] ? "border-red-300 bg-red-50" : "border-gray-200"
  } focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none text-gray-700`;

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
              <Link to="/login" className="text-sm font-medium text-[#1E3A5F] hover:text-[#D4AF37] transition-colors">
                Kirish
              </Link>
              <Link to="/signup" className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-full text-sm font-medium">
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
              <Link to="/login" className="block py-2 text-[#1E3A5F] font-medium" onClick={() => setMobileMenuOpen(false)}>Kirish</Link>
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
                Bizga qo'shiling!
              </h1>
              
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Ro'yxatdan o'ting va o'zingizga mos to'yxonani toping yoki o'z to'yxonangizni ro'yxatdan o'tkazing
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 max-w-sm mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <User className="w-7 h-7 text-[#D4AF37] mx-auto mb-2" />
                  <div className="text-white font-medium text-sm">Foydalanuvchi</div>
                  <div className="text-white/60 text-xs">To'yxona izlash</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <Crown className="w-7 h-7 text-[#D4AF37] mx-auto mb-2" />
                  <div className="text-white font-medium text-sm">To'yxona egasi</div>
                  <div className="text-white/60 text-xs">To'yxona qo'shish</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
          <div ref={formRef} className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-4">
              <div className="w-14 h-14 bg-[#1E3A5F] rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h1 className="text-xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bizga qo'shiling!
              </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 border border-gray-100">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full mb-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-sm font-medium">Ro'yxatdan o'tish</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Yangi hisob yarating
                </h2>
              </div>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-sm">Muvaffaqiyatli! Kirish sahifasiga yo'naltirilmoqdasiz...</span>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm">{errors.server || "Xatolik yuz berdi"}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* First & Last Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1E3A5F] mb-1">Ism</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={inputClasses("firstname")}
                        placeholder="Ism"
                      />
                    </div>
                    {errors.firstname && <p className="mt-1 text-xs text-red-500">{errors.firstname}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E3A5F] mb-1">Familiya</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={inputClasses("lastname")}
                        placeholder="Familiya"
                      />
                    </div>
                    {errors.lastname && <p className="mt-1 text-xs text-red-500">{errors.lastname}</p>}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1">Foydalanuvchi nomi</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClasses("username")}
                      placeholder="Foydalanuvchi nomi"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1E3A5F] mb-1">Parol</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${inputClasses("password")} pr-10`}
                        placeholder="Parol"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E3A5F] mb-1">Tasdiqlash</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClasses("confirmPassword")} pr-10`}
                        placeholder="Qayta kiriting"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1">Ro'l</label>
                  <div className="relative flex items-center">
                    <UserCheck className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none text-gray-700 text-sm appearance-none bg-white"
                    >
                      <option value="user">Foydalanuvchi</option>
                      <option value="owner">To'yxona egasi</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#c49a2c] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/25 disabled:opacity-70 mt-4 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Ro'yxatdan o'tmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Ro'yxatdan o'tish</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm">yoki</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Allaqachon hisobingiz bormi?{" "}
                  <Link to="/login" className="text-[#D4AF37] hover:text-[#c49a2c] font-medium">
                    Kirish
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

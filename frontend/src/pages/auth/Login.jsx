"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Heart, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://13.51.241.247/api/auth/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const decoded = jwtDecode(data.token);
      const role = decoded.role;

      // Navigate to corresponding route
      navigate(`/${role}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Server error occurred. Please try again later.");
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  // Decorative hearts
  const hearts = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-200 opacity-50 z-0"
          style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: heart.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: heart.delay,
          }}
        >
          <Heart size={20 + Math.random() * 30} fill="currentColor" />
        </motion.div>
      ))}

      <div className="max-w-md mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          {/* Colored header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-8 text-white text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <h2 className="text-2xl font-bold mb-2">Tizimga kirish</h2>
              <p className="opacity-90">To'yxona.uz tizimiga xush kelibsiz</p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="px-6 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Error message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertCircle className="mr-2 text-red-500" size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username */}
            <motion.div className="mb-4" variants={itemVariants}>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Foydalanuvchi nomi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Foydalanuvchi nomini kiriting"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Parolni kiriting"
                  required
                />
              </div>
            </motion.div>

            {/* Forgot password link */}
            <motion.div className="mb-6 text-right" variants={itemVariants}>
              <Link
                to="/forgot-password"
                className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
              >
                Parolni unutdingizmi?
              </Link>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Kirish...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Kirish</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </motion.button>
            </motion.div>

            {/* Signup link */}
            <motion.div
              className="mt-6 text-center text-sm"
              variants={itemVariants}
            >
              <p className="text-gray-600">
                Hisobingiz yo'qmi?{" "}
                <Link
                  to="/signup"
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Ro'yxatdan o'tish
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="mt-8 flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-300"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

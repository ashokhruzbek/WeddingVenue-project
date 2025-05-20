import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { User, Lock, Mail, UserCheck, ArrowRight, Heart, CheckCircle, AlertCircle } from 'lucide-react'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: "owner",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstname.trim()) newErrors.firstname = "Ism kiritilishi shart"
    if (!formData.lastname.trim()) newErrors.lastname = "Familiya kiritilishi shart"
    if (!formData.username.trim()) newErrors.username = "Foydalanuvchi nomi kiritilishi shart"
    if (formData.password.length < 4) newErrors.password = "Parol kamida 4 ta belgidan iborat bo'lishi kerak"
    if (formData.password !== confirmPassword) newErrors.confirmPassword = "Parollar mos kelmadi"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await axios.post("http://localhost:4000/signup", formData)

      setSubmitStatus("success")

      // Redirect after successful signup (after showing success message)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)
      setSubmitStatus("error")

      if (error.response?.data?.message) {
        // Handle specific error from backend
        setErrors((prev) => ({
          ...prev,
          server: error.response.data.message,
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          server: "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  }

  // Decorative hearts
  const hearts = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 5,
  }))

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
            repeat: Infinity,
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
              <h2 className="text-2xl font-bold mb-2">Ro'yxatdan o'tish</h2>
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
            {/* Success message */}
            {submitStatus === "success" && (
              <motion.div
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <CheckCircle className="mr-2 text-green-500" size={20} />
                <span>Ro'yxatdan muvaffaqiyatli o'tdingiz! Kirish sahifasiga yo'naltirilmoqdasiz...</span>
              </motion.div>
            )}

            {/* Error message */}
            {submitStatus === "error" && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertCircle className="mr-2 text-red-500" size={20} />
                <span>{errors.server || "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."}</span>
              </motion.div>
            )}

            {/* First name */}
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                Ism
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                    errors.firstname ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="Ismingizni kiriting"
                />
              </div>
              {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
            </motion.div>

            {/* Last name */}
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                Familiya
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                    errors.lastname ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="Familiyangizni kiriting"
                />
              </div>
              {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
            </motion.div>

            {/* Username */}
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Foydalanuvchi nomi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                    errors.username ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="Foydalanuvchi nomini kiriting"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </motion.div>

            {/* Password */}
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="Parolni kiriting"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                    errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="Parolni qayta kiriting"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </motion.div>

            {/* Role selection */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Ro'l
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCheck className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none appearance-none"
                >
                  <option value="owner">To'yxona egasi</option>
                  <option value="user">Foydalanuvchi</option>
                </select>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Ro'yxatdan o'tmoqda...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Ro'yxatdan o'tish</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </motion.button>
            </motion.div>

            {/* Login link */}
            <motion.div className="mt-6 text-center text-sm" variants={itemVariants}>
              <p className="text-gray-600">
                Allaqachon ro'yxatdan o'tganmisiz?{" "}
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium">
                  Kirish
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
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Signup

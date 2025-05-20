 

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
 
import { Home, Heart, Calendar, Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"


export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  // Hearts animation
  const hearts = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 5,
  }))

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating hearts background */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-300 opacity-70"
          style={{ left: `${heart.x}%` }}
          initial={{ y: "110vh", opacity: 0.5, scale: 0.5 + Math.random() }}
          animate={{
            y: "-10vh",
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5 + Math.random(), 0.8 + Math.random(), 0.5 + Math.random()],
          }}
          transition={{
            duration: heart.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: heart.delay,
            ease: "easeInOut",
          }}
        >
          <Heart size={16 + Math.random() * 24} fill="currentColor" />
        </motion.div>
      ))}

      <motion.div
        className="max-w-3xl mx-auto text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main error graphic */}
        <motion.div
          className="mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="text-[180px] font-bold text-pink-200 leading-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              404
            </motion.div>

            {/* Animated elements on top of 404 */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ rotate: -10, y: 20 }}
              animate={{ rotate: [0, -5, 5, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full border-4 border-pink-300 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <Calendar className="w-12 h-12 md:w-16 md:h-16 mx-auto text-pink-500 mb-2" />
                    <motion.div
                      className="text-sm font-medium text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      To'yxona
                      <br />
                      topilmadi
                    </motion.div>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" variants={itemVariants}>
          Voy! Bu to'yxona mavjud emas
        </motion.h1>

        <motion.p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto" variants={itemVariants}>
          Siz qidirayotgan to'yxona topilmadi. Balki u boshqa manzilga ko'chgan yoki to'y mavsumi tugagan bo'lishi
          mumkin.
        </motion.p>

        {/* Animated search suggestions */}
        <motion.div className="mb-10 bg-white p-6 rounded-xl shadow-md" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <Search className="mr-2 text-pink-500" size={20} />
            Boshqa to'yxonalarni ko'rib chiqing
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              "Sergeli tumani",
              "Chilonzor tumani",
              "Premium to'yxonalar",
              "Arzon to'yxonalar",
              "Markaziy to'yxonalar",
              "Yangi to'yxonalar",
            ].map((suggestion, index) => (
              <motion.a
                key={index}
                href="#"
                className="py-2 px-3 bg-pink-50 hover:bg-pink-100 rounded-lg text-gray-700 transition-colors duration-200 flex items-center justify-center text-center"
                whileHover={{ scale: 1.05, backgroundColor: "#FDF2F8" }}
                whileTap={{ scale: 0.98 }}
              >
                {suggestion}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Back to home button */}
        <motion.div variants={itemVariants}>
          <Link to="/">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium flex items-center justify-center mx-auto shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              // onClick={()=>{navigate('/')}}
            >
              <Home className="mr-2" size={20} />
              Bosh sahifaga qaytish
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="mt-16 flex justify-center space-x-4"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-300"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

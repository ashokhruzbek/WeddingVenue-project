 

import { useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react'

export default function AnimatedFooter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    },
  }

  const socialVariants = {
    hover: { 
      scale: 1.2, 
      rotate: [0, 10, -10, 0],
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    }
  }

  const waveVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-16 pb-8">
      {/* Animated wave background */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-[2000px] h-full"
          variants={waveVariants}
          animate="animate"
        >
          <svg viewBox="0 0 1000 200" className="w-full h-full">
            <path
              d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,200 L0,200 Z"
              fill="white"
            />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3 
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              To'yxona.uz
            </motion.h3>
            <motion.p 
              className="text-blue-200 max-w-xs"
              variants={itemVariants}
            >
              Toshkent shahridagi eng yaxshi to'yxonalarni toping va band qiling. Biz bilan to'yingiz yanada go'zal o'tadi!
            </motion.p>
            
            <motion.div className="flex space-x-4 pt-2" variants={itemVariants}>
              {[
                { icon: <Instagram size={20} />, href: "#" },
                { icon: <Facebook size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
                  variants={socialVariants}
                  whileHover="hover"
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold">Tezkor havolalar</h3>
            <ul className="space-y-2">
              {[
                { name: "Bosh sahifa", href: "#" },
                { name: "To'yxonalar", href: "#" },
                { name: "Biz haqimizda", href: "#" },
                { name: "Bog'lanish", href: "#" },
                { name: "Yordam", href: "#" }
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a 
                    href={link.href} 
                    className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold">Bog'lanish</h3>
            <ul className="space-y-3">
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin size={18} className="mr-3 mt-1 text-blue-300" />
                <span className="text-blue-200">Toshkent sh., Amir Temur ko'chasi, 108-uy</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Phone size={18} className="mr-3 text-blue-300" />
                <span className="text-blue-200">+998 90 123 45 67</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail size={18} className="mr-3 text-blue-300" />
                <span className="text-blue-200">info@toyxona.uz</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold">Yangiliklardan xabardor bo'ling</h3>
            <p className="text-blue-200">Eng so'nggi yangiliklarni olish uchun obuna bo'ling</p>
            
            {isSubmitted ? (
              <motion.div 
                className="bg-green-500/20 p-4 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <p className="flex items-center">
                  <Heart className="mr-2 text-pink-400" size={18} />
                  <span>Rahmat! Siz muvaffaqiyatli obuna bo'ldingiz.</span>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email manzilingiz"
                    className="px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent my-8"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        {/* Copyright */}
        <motion.div 
          className="text-center text-blue-300 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} To'yxona.uz. Barcha huquqlar himoyalangan.</p>
          <motion.div 
            className="mt-2 flex justify-center space-x-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <a href="#" className="hover:text-white transition-colors duration-200">Maxfiylik siyosati</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Foydalanish shartlari</a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

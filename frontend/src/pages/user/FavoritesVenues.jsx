"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import {
  Building,
  Phone,
  Users,
  DollarSign,
  ImageIcon,
  Heart,
  MapPin,
  Star,
  Sparkles,
  Eye,
  Calendar,
  Crown,
  ArrowLeft,
  Trash2,
  HeartOff,
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
  exit: {
    y: -20,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
}

const Favorites = () => {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFavoriteVenues = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi")

      // LocalStorage dan sevimli IDlar olish
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]")
      if (favoriteIds.length === 0) {
        setVenues([])
        setLoading(false)
        return
      }

      const response = await axios.get("http://localhost:4000/user/get-venues-user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "tasdiqlangan" },
      })

      // Faqat sevimli IDlarga mos keladiganlarni filterlash
      const allVenues = response.data.venues || response.data
      const favoriteVenues = allVenues.filter((venue) => favoriteIds.includes(venue.id))

      setVenues(favoriteVenues)
    } catch (error) {
      console.error("Xatolik yuz berdi:", error)
      setError(error.response?.data?.error || error.message || "Sevimli to'yxonalarni olishda xatolik yuz berdi")
      toast.error(error.response?.data?.error || "Sevimli to'yxonalarni olishda xatolik yuz berdi")
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        // navigate("/login") - Next.js da router.push("/login") ishlatish kerak
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavoriteVenues()
  }, [fetchFavoriteVenues])

  // Sevimlidan o'chirish funksiyasi
  const removeFavorite = (venueId) => {
    // localStorage dan o'chirish
    const updatedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]").filter((id) => id !== venueId)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))

    // State dan o'chirish (animatsiya bilan)
    setVenues((prev) => prev.filter((venue) => venue.id !== venueId))

    toast.success("💔 To'yxona sevimlilardan o'chirildi")
  }

  // Barcha sevimlilarni tozalash
  const clearAllFavorites = () => {
    localStorage.setItem("favorites", JSON.stringify([]))
    setVenues([])
    toast.success("🗑️ Barcha sevimlilar tozalandi")
  }

  const goBack = () => {
    // navigate(-1) - Next.js da router.back() ishlatish kerak
    console.log("Go back")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-100/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-rose-100/50 rounded-full blur-xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 py-12">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goBack}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 border border-white/20"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </motion.button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <Heart className="h-8 w-8 text-white fill-white" />
                  </div>
                  <Sparkles className="w-5 h-5 text-white absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">💕 Sevimli To'yxonalar</h1>
                  <p className="text-pink-100 text-sm mt-1">Sizning tanlagan eng yaxshi to'yxonalar</p>
                </div>
              </div>
            </div>
            {venues.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFavorites}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/20"
              >
                <Trash2 className="h-4 w-4" />
                <span>Barchasini tozalash</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-pink-400 animate-spin"></div>
              <div
                className="absolute top-0 left-0 h-20 w-20 rounded-full border-t-4 border-b-4 border-rose-300 animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              ></div>
              <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-pink-500 fill-pink-500" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-700">Sevimlilar yuklanmoqda...</p>
              <div className="flex mt-2 space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        ) : venues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartOff className="h-16 w-16 text-pink-300" />
              </div>
              <div className="absolute top-0 right-1/2 transform translate-x-12 -translate-y-2">
                <Sparkles className="h-6 w-6 text-pink-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">💔 Sevimli to'yxonalar topilmadi</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Hali birorta to'yxonani sevimli qilmagansiz. To'yxonalarni sevimli qilish uchun yurak belgisini bosing
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Building className="h-5 w-5" />
              To'yxonalarni ko'rish
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border border-pink-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                    <span className="text-sm text-gray-600">
                      Sevimlilar: <span className="font-semibold text-gray-800">{venues.length}</span> ta to'yxona
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">Tanlangan eng yaxshilari</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Crown className="h-4 w-4 text-pink-400" />
                  Premium tanlov
                </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {venues.map((venue, index) => (
                  <motion.div
                    key={venue.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white relative group"
                  >
                    {/* Favorite Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Sevimli
                      </div>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      onClick={() => removeFavorite(venue.id)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 group-hover:scale-110"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-5 w-5 fill-pink-500 text-pink-500 hover:fill-red-500 hover:text-red-500 transition-colors" />
                    </motion.button>

                    {/* Image Section */}
                    {venue.images && venue.images.length > 0 ? (
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100">
                        <img
                          src={`http://localhost:4000/${venue.images[0]}`}
                          alt={venue.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          <span>{venue.images.length}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-pink-300 mx-auto mb-2" />
                          <p className="text-sm text-pink-400">Rasm mavjud emas</p>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 pr-2">
                          {index + 1}. {venue.name}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 flex items-center gap-1 whitespace-nowrap">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {venue.status}
                        </span>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-pink-500 flex-shrink-0" />
                          <span className="truncate">{venue.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4 text-rose-500 flex-shrink-0" />
                          <span>👥 Sig'im: {venue.capacity} kishi</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4 text-pink-500 flex-shrink-0" />
                          <span className="font-semibold text-gray-800">
                            💰 {Number(venue.price_seat).toLocaleString("uz-UZ")} so'm
                          </span>
                        </div>
                        {venue.address && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-rose-500 flex-shrink-0" />
                            <span className="truncate text-xs">{venue.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Additional Images */}
                      {venue.images && venue.images.length > 1 && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-pink-500" />
                            <span className="text-xs text-gray-600">Qo'shimcha rasmlar</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {venue.images.slice(1, 4).map((image, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="relative h-12 rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200"
                              >
                                <img
                                  src={`http://localhost:4000/${image}`}
                                  alt={`${venue.name} image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-pink-100 flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium">
                          <Calendar className="h-4 w-4" />
                          Bron qilish
                        </button>
                        <button
                          onClick={() => removeFavorite(venue.id)}
                          className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Building,
  Phone,
  Users,
  DollarSign,
  ImageIcon,
  Heart,
  MapPin,
  Calendar,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const heartVariants = {
  filled: {
    scale: [1, 1.3, 1],
    color: "#EC4899",
    transition: { duration: 0.3 },
  },
  unfilled: {
    scale: 1,
    color: "#6B7280",
    transition: { duration: 0.3 },
  },
};

const fixImageUrl = (url) => {
  if (!url) return "";
  return url.replace(/\\/g, "/").replace(/(\/uploads)+/g, "/uploads");
};

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Iltimos, tizimga kiring");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      const response = await axios.get("http://localhost:4000/user/get-venues-user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "tasdiqlangan" },
      });

      const filteredVenues = (response.data.venues || response.data).filter(
        (venue) => venue.status === "tasdiqlangan"
      );
      setVenues(filteredVenues);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
      setError(err.response?.data?.error || err.message || "To'yxonalarni olishda xatolik yuz berdi");
      toast.error(err.response?.data?.error || "To'yxonalarni olishda xatolik yuz berdi");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const toggleFavorite = (venueId) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId];
      if (typeof window !== "undefined") localStorage.setItem("favorites", JSON.stringify(newFavs));

      toast.success(
        prev.includes(venueId)
          ? "💔 To'yxona sevimlilardan o'chirildi"
          : "💕 To'yxona sevimlilarga qo'shildi"
      );

      return newFavs;
    });
  };

  const navigateToFavorites = () => {
    navigate("/user/favorites");
  };

  const sortedVenues = venues.sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      {/* Background blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-100/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-rose-100/50 rounded-full blur-xl"></div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 py-12">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-white absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">💒 Tasdiqlangan To'yxonalar</h1>
                <p className="text-pink-100 text-sm mt-1">Eng yaxshi to'yxonalarni tanlang</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToFavorites}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/20"
            >
              <Heart className="h-5 w-5" />
              <span>💕 Sevimlilar ({favorites.length})</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Content */}
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
              <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-pink-500" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-700">To'yxonalar yuklanmoqda...</p>
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
            <div className="mb-4">
              <Building className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">To'yxonalar topilmadi</h3>
              <p className="text-gray-500">Hozirda tasdiqlangan to'yxonalar mavjud emas</p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border border-pink-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-pink-500" />
                  <span className="text-sm text-gray-600">
                    Jami: <span className="font-semibold text-gray-800">{venues.length}</span> ta to'yxona
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Sevimlilar yuqorida ko'rsatiladi
                </div>
              </div>
            </div>

            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedVenues.map((venue, index) => (
                  <motion.div
                    key={venue.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 relative group ${
                      favorites.includes(venue.id)
                        ? "border-pink-300 bg-gradient-to-br from-pink-50 to-white"
                        : "border-pink-100 hover:border-pink-200"
                    }`}
                  >
                    {favorites.includes(venue.id) && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Sevimli
                        </div>
                      </div>
                    )}

                    <motion.div
                      className="absolute top-3 right-3 z-10"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(venue.id)}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <Heart
                          className={`h-5 w-5 cursor-pointer transition-all duration-200 ${
                            favorites.includes(venue.id)
                              ? "fill-pink-500 text-pink-500"
                              : "text-gray-500 hover:text-pink-400"
                          }`}
                          variants={heartVariants}
                          animate={favorites.includes(venue.id) ? "filled" : "unfilled"}
                        />
                      </div>
                    </motion.div>

                    {/* Slayder rasm uchun */}
                    {venue.images && venue.images.length > 0 ? (
                      <Slider {...sliderSettings} className="h-48 rounded-t-2xl overflow-hidden">
                        {venue.images.map((img, idx) => (
                          <div key={idx} className="h-48">
                            <img
                              src={fixImageUrl(img.image_url)}
                              alt={`${venue.name} - ${idx + 1}`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center rounded-t-2xl">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-pink-300 mx-auto mb-2" />
                          <p className="text-sm text-pink-400">Rasm mavjud emas</p>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                          {index + 1}. {venue.name}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 flex items-center gap-1">
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

                      <div className="mt-4 pt-3 border-t border-pink-100">
                        <button
                          onClick={() => navigate(`/user/bookings?venueId=${venue.id}`)}
                          className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Calendar className="h-4 w-4" />
                          Bron qilish
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
  );
};

export default Venues;

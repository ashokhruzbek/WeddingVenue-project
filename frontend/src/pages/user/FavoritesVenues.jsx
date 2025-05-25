"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Building, Phone, Users, DollarSign, ImageIcon, Heart } from "lucide-react";

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
  exit: {
    y: -20,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

const Favorites = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFavoriteVenues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      // LocalStorage dan sevimli IDlar olish
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favoriteIds.length === 0) {
        setVenues([]);
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:4000/user/get-venues-user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "tasdiqlangan" },
      });

      // Faqat sevimli IDlarga mos keladiganlarni filterlash
      const allVenues = response.data.venues || response.data;
      const favoriteVenues = allVenues.filter((venue) =>
        favoriteIds.includes(venue.id)
      );

      setVenues(favoriteVenues);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Sevimli to'yxonalarni olishda xatolik yuz berdi"
      );
      toast.error(
        error.response?.data?.error ||
          "Sevimli to'yxonalarni olishda xatolik yuz berdi"
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchFavoriteVenues();
  }, [fetchFavoriteVenues]);

  // Sevimlidan o'chirish funksiyasi
  const removeFavorite = (venueId) => {
    // localStorage dan o'chirish
    const updatedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]").filter(
      (id) => id !== venueId
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    
    // State dan o'chirish (animatsiya bilan)
    setVenues((prev) => prev.filter((venue) => venue.id !== venueId));
    
    toast.success("To'yxona sevimlilardan o'chirildi");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">Sevimli to'yxonalar</h1>
        </div>
        <div className="text-sm text-gray-500">
          Jami: {venues.length} ta
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
            <div
              className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-300 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
        </div>
      ) : venues.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-20"
        >
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Sevimli to'yxonalar topilmadi
          </h3>
          <p className="text-gray-400">
            To'yxonalarni sevimli qilish uchun yurak belgisini bosing
          </p>
        </motion.div>
      ) : (
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
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative"
              >
                <motion.button
                  onClick={() => removeFavorite(venue.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Remove from favorites"
                >
                  <Heart 
                    className="h-5 w-5 fill-pink-500 text-pink-500 hover:fill-pink-600 hover:text-pink-600 transition-colors" 
                  />
                </motion.button>

                {venue.images && venue.images.length > 0 ? (
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={`http://localhost:4000/${venue.images[0]}`}
                      alt={venue.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>{venue.images.length}</span>
                      <ImageIcon className="h-3 w-3" />
                    </div>
                  </div>
                ) : (
                  <div className="h-56 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 pr-2">
                      {index + 1}. {venue.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-300 whitespace-nowrap">
                      {venue.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-pink-500 flex-shrink-0" />
                      <span>{venue.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-pink-500 flex-shrink-0" />
                      <span>O'rindiqlar: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-pink-500 flex-shrink-0" />
                      <span>
                        Narxi: {Number(venue.price_seat).toLocaleString("uz-UZ")} so'm
                      </span>
                    </div>
                  </div>

                  {venue.images && venue.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {venue.images.slice(1, 4).map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative h-16 rounded-md overflow-hidden bg-gray-100"
                        >
                          <img
                            src={`http://localhost:4000/${image}`}
                            alt={`${venue.name} image ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Favorites;
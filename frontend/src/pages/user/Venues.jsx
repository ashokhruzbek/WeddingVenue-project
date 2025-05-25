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

const Venues = () => {
  const [venues, setVenues] = useState([]);
  // localStorage-dan darhol yuklash
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem("favorites");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // localStorage-ga saqlash
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "To'yxonalarni olishda xatolik yuz berdi"
      );
      toast.error(
        error.response?.data?.error ||
          "To'yxonalarni olishda xatolik yuz berdi"
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
    fetchVenues();
  }, [fetchVenues]);

  const toggleFavorite = (venueId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId];
      
      // Darhol localStorage-ga saqlash
      if (typeof window !== 'undefined') {
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      }
      
      if (prev.includes(venueId)) {
        toast.success("To'yxona sevimlilardan o'chirildi");
      } else {
        toast.success("To'yxona sevimlilarga qo'shildi");
      }
      
      return newFavorites;
    });
  };

  const navigateToFavorites = () => {
    navigate("/user/favorites");
  };

  // Sevimli cardlarni yuqorida ko'rsatish uchun sorting
  const sortedVenues = venues.sort((a, b) => {
    const aIsFavorite = favorites.includes(a.id);
    const bIsFavorite = favorites.includes(b.id);
    
    // Sevimlilar yuqorida bo'lsin (true > false)
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0; // Agar ikkalasi ham sevimli yoki ikkalasi ham sevimli bo'lmasa
  });

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
          <h1 className="text-2xl font-bold text-gray-800">Tasdiqlangan to'yxonalar</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={navigateToFavorites}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          <Heart className="h-5 w-5" />
          <span>Sevimlilar</span>
        </motion.button>
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
          className="text-center py-20 text-gray-500"
        >
          Tasdiqlangan to'yxonalar topilmadi
        </motion.div>
      ) : (
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
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative"
              >
                <motion.div
                  className="absolute top-3 right-3 z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(venue.id)}
                >
                  <Heart
                    className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                      favorites.includes(venue.id)
                        ? "fill-pink-500 text-pink-500"
                        : "text-gray-500 hover:text-pink-300"
                    }`}
                    variants={heartVariants}
                    animate={favorites.includes(venue.id) ? "filled" : "unfilled"}
                  />
                </motion.div>

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
                    <h3 className="text-lg font-bold text-gray-800">
                      {index + 1}. {venue.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-300`}
                    >
                      {venue.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-pink-500" />
                      <span>{venue.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-pink-500" />
                      <span>O'rindiqlar: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-pink-500" />
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

export default Venues;
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Users, DollarSign, Phone, Filter } from "lucide-react";
import { toast } from "react-toastify";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClickCheck = () => {
    if (!token) {
      toast.error("Iltimos, avval tizimga kiring!", {
        duration: 3000,
        position: "top-right",
        richColors: true,
        action: {
          label: "Kirish",
          onClick: () => navigate("/login"),
        },
      });
      navigate("/login");
    }
  };

  // Backenddan to’yxonalar va ularning rasmlarini olish
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/venues");
        setVenues(res.data.venues);
        setFilteredVenues(res.data.venues);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, []);

  // Qidiruv va tuman bo‘yicha filtr
  useEffect(() => {
    const result = venues.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesDistrict =
        districtFilter === "all" || item.district_id === Number(districtFilter);
      return matchesSearch && matchesDistrict;
    });
    setFilteredVenues(result);
  }, [search, districtFilter, venues]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };

  // URLdagi backslashni to‘g‘rilash va ortiqcha uploads ni bitta qilish
  const fixImageUrl = (url) => {
    if (!url) return "";
    return url.replace(/\\/g, "/").replace(/(\/uploads)+/g, "/uploads");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-2 text-blue-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          To'yxonalar
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Toshkent shahridagi eng yaxshi to'yxonalarni toping va band qiling
        </motion.p>

        {/* Search va filter */}
        <motion.div
          className="max-w-4xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Qidiruv (nomi bo'yicha)..."
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-1/3">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="all">Barcha tumanlar</option>
                {/* Boshqa optionlarni ham qo‘shing */}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Natijalar soni */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <p className="text-gray-600 font-medium">{filteredVenues.length} ta natija topildi</p>
        </motion.div>

        {/* To’yxona kartalari */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVenues.length === 0 ? (
                <motion.p
                  className="text-center col-span-full text-lg text-gray-500 py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Hech narsa topilmadi...
                </motion.p>
              ) : (
                filteredVenues.map((venue) => (
                  <motion.div
                    key={venue.id}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer"
                    layoutId={`venue-${venue.id}`}
                  >
                    {/* Rasm slayderi */}
                    <Slider {...sliderSettings} className="h-40 rounded-t-2xl overflow-hidden">
                      {venue.images && venue.images.length > 0 ? (
                        venue.images.map((img, idx) => (
                          <div key={idx} className="h-40">
                            <img
                              src={fixImageUrl(img.image_url)}
                              alt={`${venue.name} - ${idx + 1}`}
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="h-40 bg-gray-200 flex items-center justify-center rounded-t-2xl">
                          <span className="text-gray-400">Rasm mavjud emas</span>
                        </div>
                      )}
                    </Slider>

                    {/* To’yxona ma’lumotlari */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-gray-700">{venue.address}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-gray-700">
                          <span className="font-semibold">{venue.capacity}</span> kishi
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-gray-700">
                          <span className="font-semibold">{venue.price_seat}</span> ming so'm
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-gray-700">{venue.phone_number}</p>
                      </div>

                      <motion.button
                        onClick={handleClickCheck}
                        className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Band qilish
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}

export default Home;

"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar,
  Star,
  Camera,
  Clock,
  Sparkles,
  Menu,
} from "lucide-react";
import { toast } from "react-toastify";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components for better control
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
    aria-label="Oldingi rasm"
  >
    <ChevronLeft size={20} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
    aria-label="Keyingi rasm"
  >
    <ChevronRight size={20} />
  </button>
);

// Toshkent shahri tumanlari ro'yxati
const tashkentDistricts = [
  { id: 1, name: "Bektemir" },
  { id: 2, name: "Mirzo Ulug'bek" },
  { id: 3, name: "Mirobod" },
  { id: 4, name: "Olmazor" },
  { id: 5, name: "Sirg'ali" },
  { id: 6, name: "Uchtepa" },
  { id: 7, name: "Chilonzor" },
  { id: 8, name: "Shayxontohur" },
  { id: 9, name: "Yunusobod" },
  { id: 10, name: "Yakkasaroy" },
  { id: 11, name: "Yashnobod" },
  { id: 12, name: "Yangihayot" },
];

function Home() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(10);

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

  // Backenddan to'yxonalar va ularning rasmlarini olish
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("api/venues/venues");
        setVenues(res.data.venues);
        setFilteredVenues(res.data.venues);
        console.log("Venues data:", res.data.venues);
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, []);

  // Qidiruv va tuman bo'yicha filtr
  useEffect(() => {
    const result = venues.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      // Backenddan keladigan district_id string bo'lishi mumkin, shuning uchun Number() ishlatamiz
      const matchesDistrict =
        districtFilter === "all" ||
        Number(item.district_id) === Number(districtFilter);
      return matchesSearch && matchesDistrict;
    });
    setFilteredVenues(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, districtFilter, venues]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  // Improved slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    adaptiveHeight: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
  };

  // URLdagi backslashni to'g'rilash va ortiqcha uploads ni bitta qilish
  const fixImageUrl = (url) => {
    if (!url) return "";
    const fixedUrl = url
      .replace(/\\/g, "/")
      .replace(/(\/uploads)+/g, "/uploads");
    return fixedUrl;
  };

  // Kartani bosganda modalni ochish uchun funksiya
  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  // Modalni yopish uchun funksiya
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };

  // Toggle favorite
  const toggleFavorite = (e, venueId) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId]
    );
  };

  // Get random rating between 4.0 and 5.0
  const getRandomRating = () => {
    return (4 + Math.random()).toFixed(1);
  };

  // Pagination logic
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(
    indexOfFirstVenue,
    indexOfLastVenue
  );
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">💍</span>
              <span className="ml-2 text-xl font-bold text-blue-600">
                WeddingVenue
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/venue"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                To'yxonalar
              </Link>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Kirish
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/venue"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  To'yxonalar
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-500 text-white hover:bg-blue-600 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kirish
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        .custom-dots {
          position: absolute;
          bottom: 20px;
          display: flex !important;
          justify-content: center;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .custom-dots li {
          margin: 0 5px;
        }

        .custom-dots li button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 12px;
          height: 12px;
          padding: 0;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .custom-dots li.slick-active button {
          background: white;
          transform: scale(1.2);
        }

        .custom-dots li button:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 py-12"
      >
        {/* Hero Section */}
        <motion.div
          className="relative mb-12 sm:mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-24 md:px-12 text-white max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Mukammal To'y Marosimi Uchun
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8">
                Toshkent shahridagi eng sara to'yxonalarni toping va o'z
                to'yingizni unutilmas qiling
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleClickCheck()}
                >
                  <Calendar size={18} />
                  Band qilish
                </motion.button>
                <motion.button
                  className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera size={18} />
                  Galereya
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-1/3 h-full hidden md:block">
            <div className="absolute bottom-0 right-0 w-full h-full bg-white/10 backdrop-blur-sm rounded-tl-[100px]"></div>
            <div className="absolute bottom-10 right-10 floating">
              <Sparkles className="text-white w-16 h-16 opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Search va filter */}
        <motion.div
          className="max-w-4xl mx-auto mb-8 sm:mb-12 bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Qidiruv (nomi bo'yicha)..."
                className="pl-10 pr-4 py-2 sm:py-3 rounded-xl border border-blue-200 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-1/3">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                size={20}
              />
              <select
                className="pl-10 pr-4 py-2 sm:py-3 rounded-xl border border-blue-200 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="all">Barcha tumanlar</option>
                {tashkentDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Natijalar soni */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
        >
          <p className="text-gray-600 font-medium">
            <span className="text-blue-600 font-bold">
              {filteredVenues.length}
            </span>{" "}
            ta natija topildi
          </p>

          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-200 transition-colors">
              Eng mashhur
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors">
              Eng arzon
            </button>
          </div>
        </motion.div>

        {/* To'yxona kartalari */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVenues.length === 0 ? (
                <motion.div
                  className="text-center col-span-full py-16 bg-white rounded-2xl shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Search className="text-blue-300 w-16 h-16" />
                    <h3 className="text-2xl font-semibold text-gray-700">
                      Hech narsa topilmadi
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Boshqa kalit so'zlar bilan qidirib ko'ring yoki filtrlarni
                      o'zgartiring
                    </p>
                  </div>
                </motion.div>
              ) : (
                currentVenues.map((venue) => (
                  <motion.div
                    key={venue.id}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100"
                    layoutId={`venue-${venue.id}`}
                    onClick={() => handleCardClick(venue)}
                  >
                    {/* Faqat birinchi rasmni ko'rsatish */}
                    <div className="h-40 sm:h-48 rounded-t-2xl overflow-hidden bg-gray-200 relative group">
                      {venue.images && venue.images.length > 0 ? (
                        <img
                          src={
                            fixImageUrl(
                              venue.images[0].image_url ||
                                "https://avatars.mds.yandex.net/get-altay/4614377/2a000001775e0e2ae26077d653b135e522c3/orig"
                            ) || "/placeholder.svg"
                          }
                          alt={`${venue.name} - asosiy rasm`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              venue.images[0].image_url
                            );
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          display:
                            venue.images && venue.images.length > 0
                              ? "none"
                              : "flex",
                        }}
                      >
                        <span className="text-gray-400">
                          <img
                            src="https://avatars.mds.yandex.net/get-altay/4614377/2a000001775e0e2ae26077d653b135e522c3/orig"
                            alt=""
                          />
                        </span>
                      </div>

                      {/* Favorite button */}
                      <button
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 z-10"
                        onClick={(e) => toggleFavorite(e, venue.id)}
                      >
                        <Heart
                          size={18}
                          className={
                            favorites.includes(venue.id)
                              ? "fill-blue-500 text-blue-500"
                              : "text-gray-500"
                          }
                        />
                      </button>

                      {/* Rating badge */}
                      <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-lg shadow-md flex items-center gap-1 text-sm">
                        <Star
                          size={14}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span className="font-medium">{getRandomRating()}</span>
                      </div>

                      {/* Image count badge */}
                      {venue.images && venue.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded-lg shadow-md flex items-center gap-1 text-sm">
                          <Camera size={14} className="text-blue-500" />
                          <span className="font-medium">
                            {venue.images.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* To'yxona ma'lumotlari */}
                    <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-start">
                        <h3
                          className="text-lg sm:text-xl font-semibold text-blue-600 truncate"
                          title={venue.name}
                        >
                          {venue.name}
                        </h3>
                        <div className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                          Premium
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={16}
                        />
                        <p
                          className="text-gray-600 truncate"
                          title={venue.address}
                        >
                          {venue.address}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2 text-sm">
                          <Users
                            className="text-blue-500 shrink-0 mt-0.5"
                            size={16}
                          />
                          <p className="text-gray-600">
                            <span className="font-medium">
                              {venue.capacity}
                            </span>{" "}
                            kishi
                          </p>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <Clock
                            className="text-blue-500 shrink-0 mt-0.5"
                            size={16}
                          />
                          <p className="text-gray-600">
                            <span className="font-medium">24/7</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm pt-1">
                        <DollarSign
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={16}
                        />
                        <p className="text-gray-600">
                          Narx:{" "}
                          <span className="font-medium text-blue-600">
                            {venue.price_seat} so'm
                          </span>
                        </p>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Phone
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={16}
                        />
                        <p className="text-gray-600">{venue.phone_number}</p>
                      </div>

                      <motion.button
                        className="w-full mt-3 sm:mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click when clicking button
                          handleCardClick(venue);
                        }}
                      >
                        <Sparkles size={18} />
                        Batafsil ko'rish
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            className="flex flex-wrap justify-center items-center gap-2 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Oldingi</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-blue-600 hover:bg-blue-100 border border-blue-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Keyingi</span>
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedVenue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeModal} // Close modal on overlay click
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">
                    {selectedVenue.name}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-6 flex-grow">
                  {/* Image Slider */}
                  {selectedVenue.images && selectedVenue.images.length > 0 ? (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                      <Slider {...sliderSettings}>
                        {selectedVenue.images.map((image, index) => (
                          <div
                            key={index}
                            className="h-[250px] sm:h-[350px] md:h-[400px] bg-gray-100"
                          >
                            <img
                              src={
                                fixImageUrl(image.image_url) ||
                                "/placeholder.svg"
                              }
                              alt={`${selectedVenue.name} - rasm ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <div className="h-[250px] sm:h-[350px] md:h-[400px] bg-gray-200 flex items-center justify-center text-gray-500 rounded-xl mb-6">
                      Rasmlar mavjud emas
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin
                          className="text-blue-500 shrink-0 mt-1"
                          size={18}
                        />
                        <div>
                          <p className="font-medium text-gray-700">Manzil:</p>
                          <p className="text-gray-600">
                            {selectedVenue.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users
                          className="text-blue-500 shrink-0 mt-1"
                          size={18}
                        />
                        <div>
                          <p className="font-medium text-gray-700">Sig'imi:</p>
                          <p className="text-gray-600">
                            {selectedVenue.capacity} kishi
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign
                          className="text-blue-500 shrink-0 mt-1"
                          size={18}
                        />
                        <div>
                          <p className="font-medium text-gray-700">
                            Narxi (soatiga):
                          </p>
                          <p className="font-semibold text-blue-600">
                            {selectedVenue.price_per_hour} so'm
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Phone
                          className="text-blue-500 shrink-0 mt-1"
                          size={18}
                        />
                        <div>
                          <p className="font-medium text-gray-700">Telefon:</p>
                          <p className="text-gray-600">
                            {selectedVenue.phone_number}
                          </p>
                        </div>
                      </div>
                      {selectedVenue.district_id && (
                        <div className="flex items-start gap-3">
                          <MapPin
                            className="text-blue-500 shrink-0 mt-1"
                            size={18}
                          />
                          <div>
                            <p className="font-medium text-gray-700">Tuman:</p>
                            <p className="text-gray-600">
                              {tashkentDistricts.find(
                                (d) =>
                                  d.id === Number(selectedVenue.district_id)
                              )?.name || "Noma'lum"}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <Clock
                          className="text-blue-500 shrink-0 mt-1"
                          size={18}
                        />
                        <div>
                          <p className="font-medium text-gray-700">
                            Ish vaqti:
                          </p>
                          <p className="text-gray-600">24/7</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedVenue.description && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-700 mb-2">
                        Tavsif
                      </h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {selectedVenue.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium order-2 sm:order-1"
                  >
                    Yopish
                  </button>
                  <button
                    onClick={() => {
                      handleClickCheck();
                      // Agar token mavjud bo'lsa, band qilish sahifasiga o'tish
                      if (token) navigate(`/booking/${selectedVenue.id}`);
                      closeModal();
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    <Calendar size={18} />
                    Band qilish
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Home;

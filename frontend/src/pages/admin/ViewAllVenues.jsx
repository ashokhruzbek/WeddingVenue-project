import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Search, Filter, SortAsc, SortDesc, RefreshCw, Building, Phone, Users, DollarSign, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

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
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const VenuesList = () => {
  const [venues, setVenues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const params = { page: currentPage, limit: 6 };
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.order = sortOrder;

      const response = await axios.get("http://localhost:4000/admin/venues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setVenues(response.data.venues || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Ma'lumotlarni olishda xatolik"
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
  }, [filterStatus, searchTerm, sortBy, sortOrder, currentPage, navigate]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const getStatusColor = (status) => {
    switch (status) {
      case "tasdiqlangan":
        return "bg-green-100 text-green-800 border-green-300";
      case "kutilmoqda":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rad etilgan":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const clearFilters = () => {
    setFilterStatus("");
    setSearchTerm("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
    toast.success("Filtrlar tozalandi");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <Building className="h-6 w-6 text-pink-500" />
        <h1 className="text-2xl font-bold text-gray-800">Barcha to'yxonalar</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-50 rounded-xl shadow-lg p-4 mb-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Nom bo'yicha qidirish"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
              disabled={loading}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              disabled={loading}
            >
              <option value="">Barchasi</option>
              <option value="tasdiqlangan">Tasdiqlangan</option>
              <option value="kutilmoqda">Kutilmoqda</option>
              <option value="tasdiqlanmagan">Tasdiqlanmagan</option>
              <option value="rad etilgan">Rad etilgan</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              disabled={loading}
            >
              <option value="">Standart</option>
              <option value="price_seat">Narx bo'yicha</option>
              <option value="capacity">Sig'im bo'yicha</option>
            </select>
            {sortOrder === "asc" ? (
              <SortAsc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            ) : (
              <SortDesc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            )}
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              disabled={loading || !sortBy}
            >
              <option value="asc">O'sish</option>
              <option value="desc">Kamayish</option>
            </select>
            {sortOrder === "asc" ? (
              <SortAsc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            ) : (
              <SortDesc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            )}
          </div>

          <button
            onClick={clearFilters}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            Tozalash
          </button>
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
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {venues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-gray-500"
            >
              To'yxonalar topilmadi
            </motion.div>
          ) : (
            <>
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
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                  >
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
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(venue.status)}`}>
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
                          <span>Narxi: {Number(venue.price_seat).toLocaleString("uz-UZ")} so'm</span>
                        </div>
                      </div>
                      
                      {venue.images && venue.images.length > 1 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {venue.images.slice(1, 4).map((image, imgIndex) => (
                            <div key={imgIndex} className="relative h-16 rounded-md overflow-hidden bg-gray-100">
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

              <div className="flex justify-center items-center mt-8">
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-lg border border-gray-200">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-pink-500 hover:bg-pink-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="text-gray-800 px-4 py-2">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-pink-500 hover:bg-pink-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default VenuesList;
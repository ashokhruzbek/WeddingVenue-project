"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import axios from "axios"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Building,
  ChevronDown,
  ChevronUp,
  Search,
  BarChart3,
  PieChartIcon,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Filter,
} from "lucide-react"

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
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const ApproveVenueDashboard = () => {
  const [venues, setVenues] = useState([])
  const [selectedVenueId, setSelectedVenueId] = useState("")
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [chartType, setChartType] = useState("pie") // 'pie' or 'bar'
  const navigate = useNavigate()

  // Fetch all venues
  const fetchVenues = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi")
      }

      const response = await axios.get("http://localhost:4000/admin/venues", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = Array.isArray(response.data.venues) ? response.data.venues : []

      const formattedData = data.map((venue) => ({
        ...venue,
        id: String(venue.id),
      }))

      setVenues(formattedData)
    } catch (error) {
      console.error("To'yxonalarni olishda xatolik:", error)
      setError("To'yxonalarni olishda xatolik yuz berdi")
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  // Load venues on component mount
  useEffect(() => {
    fetchVenues()
  }, [])

  // Format status in Uzbek
  const formatStatus = (status) => {
    switch (status) {
      case "pending":
      case "kutilmoqda":
        return { text: "Kutilmoqda", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" }
      case "approved":
      case "tasdiqlangan":
        return { text: "Tasdiqlangan", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" }
      case "rejected":
      case "rad etilgan":
        return { text: "Rad etilgan", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" }
      default:
        return { text: "Noma'lum", icon: AlertTriangle, color: "text-gray-500", bg: "bg-gray-500/10" }
    }
  }

  // Handle approval or rejection
  const handleAction = async (action, venueId = selectedVenueId) => {
    if (!venueId) {
      setError("Iltimos, to'yxona tanlang")
      return
    }

    setError(null)
    setActionLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi")
      }

      const endpoint = action === "approve" ? "approve-venue" : "reject-venue"

      const response = await axios.put(
        `http://localhost:4000/admin/${endpoint}/${venueId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      toast.success(
        response.data.message ||
          (action === "approve" ? "To'yxona muvaffaqiyatli tasdiqlandi" : "To'yxona muvaffaqiyatli rad etildi"),
      )

      // Update venues list and clear selection
      await fetchVenues()
      setSelectedVenueId("")
    } catch (error) {
      console.error(`Error ${action === "approve" ? "approving" : "rejecting"} venue:`, error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        `${action === "approve" ? "Tasdiqlashda" : "Rad etishda"} xatolik yuz berdi`
      setError(errorMessage)
      toast.error(errorMessage)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    } finally {
      setActionLoading(false)
    }
  }

  // Get selected venue
  const selectedVenue = useMemo(
    () => (venues && Array.isArray(venues) ? venues.find((venue) => venue.id === selectedVenueId) : null),
    [venues, selectedVenueId],
  )

  // Filter venues based on search term and status filter
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter ? venue.status === statusFilter : true
      return matchesSearch && matchesStatus
    })
  }, [venues, searchTerm, statusFilter])

  // Calculate statistics for charts
  const venueStats = useMemo(() => {
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    }

    venues.forEach((venue) => {
      if (venue.status in statusCounts) {
        statusCounts[venue.status]++
      } else if (venue.status === "kutilmoqda") {
        statusCounts.pending++
      } else if (venue.status === "tasdiqlangan") {
        statusCounts.approved++
      } else if (venue.status === "rad etilgan") {
        statusCounts.rejected++
      }
    })

    // Calculate capacity ranges
    const capacityRanges = {
      "0-100": 0,
      "101-300": 0,
      "301-500": 0,
      "501+": 0,
    }

    venues.forEach((venue) => {
      const capacity = Number(venue.capacity)
      if (capacity <= 100) {
        capacityRanges["0-100"]++
      } else if (capacity <= 300) {
        capacityRanges["101-300"]++
      } else if (capacity <= 500) {
        capacityRanges["301-500"]++
      } else {
        capacityRanges["501+"]++
      }
    })

    // Calculate price ranges (in thousands)
    const priceRanges = {
      "0-20k": 0,
      "21k-50k": 0,
      "51k-100k": 0,
      "100k+": 0,
    }

    venues.forEach((venue) => {
      const price = Number(venue.price_seat)
      if (price <= 20000) {
        priceRanges["0-20k"]++
      } else if (price <= 50000) {
        priceRanges["21k-50k"]++
      } else if (price <= 100000) {
        priceRanges["51k-100k"]++
      } else {
        priceRanges["100k+"]++
      }
    })

    return {
      statusCounts,
      capacityRanges,
      priceRanges,
      total: venues.length,
    }
  }, [venues])

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <Building className="h-6 w-6 text-[#ff1a75]" />
        <h1 className="text-2xl font-bold text-white">To'yxonalarni tasdiqlash paneli</h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-[#242b3d] rounded-xl p-4 shadow-lg flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm">Jami to'yxonalar</p>
            <h3 className="text-2xl font-bold text-white">{venues.length}</h3>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-full">
            <Building className="h-6 w-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#242b3d] rounded-xl p-4 shadow-lg flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm">Kutilmoqda</p>
            <h3 className="text-2xl font-bold text-yellow-500">{venueStats.statusCounts.pending}</h3>
          </div>
          <div className="bg-yellow-500/10 p-3 rounded-full">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#242b3d] rounded-xl p-4 shadow-lg flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm">Tasdiqlangan</p>
            <h3 className="text-2xl font-bold text-green-500">{venueStats.statusCounts.approved}</h3>
          </div>
          <div className="bg-green-500/10 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#242b3d] rounded-xl p-4 shadow-lg flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm">Rad etilgan</p>
            <h3 className="text-2xl font-bold text-red-500">{venueStats.statusCounts.rejected}</h3>
          </div>
          <div className="bg-red-500/10 p-3 rounded-full">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Selection Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1 bg-[#242b3d] rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">To'yxonalar ro'yxati</h2>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="To'yxona nomini qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff1a75] focus:border-transparent bg-[#1a1f2e] text-white"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff1a75] focus:border-transparent appearance-none bg-[#1a1f2e] text-white"
                >
                  <option value="">Barcha statuslar</option>
                  <option value="pending">Kutilmoqda</option>
                  <option value="approved">Tasdiqlangan</option>
                  <option value="rejected">Rad etilgan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Venues List */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="h-10 w-10 border-2 border-[#ff1a75] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-10 text-gray-400">To'yxonalar topilmadi</div>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence>
                  {filteredVenues.map((venue) => {
                    const status = formatStatus(venue.status)
                    const StatusIcon = status.icon
                    return (
                      <motion.li
                        key={venue.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedVenueId === venue.id
                            ? "bg-[#ff1a75]/10 border border-[#ff1a75]/30"
                            : "bg-[#1a1f2e] hover:bg-[#2a3042] border border-transparent"
                        }`}
                        onClick={() => setSelectedVenueId(venue.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            <span className="font-medium text-white">{venue.name}</span>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                            {status.text}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400 flex justify-between">
                          <span>O'rindiqlar: {venue.capacity}</span>
                          <span>{Number(venue.price_seat).toLocaleString("uz-UZ")} so'm</span>
                        </div>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => fetchVenues()}
              disabled={loading}
              className="w-full py-2 px-4 bg-[#1a1f2e] hover:bg-[#2a3042] text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Yangilash
            </button>
          </div>
        </motion.div>

        {/* Venue Details and Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-[#242b3d] rounded-xl shadow-lg overflow-hidden"
        >
          {selectedVenue ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">To'yxona ma'lumotlari</h2>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              <div className="p-4 flex-1 overflow-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Venue Images */}
                  <div className="md:w-1/2">
                    {selectedVenue.images && selectedVenue.images.length > 0 ? (
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:4000/${selectedVenue.images[0].image_url}`}
                          alt={selectedVenue.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-3 w-full">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-medium">{selectedVenue.name}</span>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                  formatStatus(selectedVenue.status).bg
                                } ${formatStatus(selectedVenue.status).color}`}
                              >
                                {formatStatus(selectedVenue.status).text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-[#1a1f2e] rounded-lg flex items-center justify-center">
                        <Building className="h-12 w-12 text-gray-600" />
                      </div>
                    )}

                    {/* Thumbnail Images */}
                    {selectedVenue.images && selectedVenue.images.length > 1 && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {selectedVenue.images.slice(1, 5).map((image, index) => (
                          <div key={index} className="h-16 rounded-md overflow-hidden">
                            <img
                              src={`http://localhost:4000/${image.image_url}`}
                              alt={`${selectedVenue.name} image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Venue Details */}
                  <div className="md:w-1/2 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedVenue.name}</h3>
                      <p className="text-gray-400">{selectedVenue.address || "Manzil ko'rsatilmagan"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#1a1f2e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Telefon</p>
                        <p className="text-white">{selectedVenue.phone_number || "Ko'rsatilmagan"}</p>
                      </div>
                      <div className="bg-[#1a1f2e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">O'rindiqlar</p>
                        <p className="text-white">{selectedVenue.capacity || "0"}</p>
                      </div>
                      <div className="bg-[#1a1f2e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Narxi</p>
                        <p className="text-white">{Number(selectedVenue.price_seat).toLocaleString("uz-UZ")} so'm</p>
                      </div>
                      <div className="bg-[#1a1f2e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Tuman</p>
                        <p className="text-white">{selectedVenue.district?.name || "Ko'rsatilmagan"}</p>
                      </div>
                    </div>

                    {/* Additional Details (shown when expanded) */}
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="bg-[#1a1f2e] p-3 rounded-lg">
                            <p className="text-gray-400 text-xs">Yaratilgan sana</p>
                            <p className="text-white">
                              {new Date(selectedVenue.created_at).toLocaleDateString("uz-UZ")}
                            </p>
                          </div>
                          <div className="bg-[#1a1f2e] p-3 rounded-lg">
                            <p className="text-gray-400 text-xs">Qo'shimcha ma'lumot</p>
                            <p className="text-white">
                              {selectedVenue.description || "Qo'shimcha ma'lumot mavjud emas"}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-700 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/venues/${selectedVenue.id}`)}
                  className="flex-1 py-2 px-4 bg-[#1a1f2e] hover:bg-[#2a3042] text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  Batafsil ko'rish
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={actionLoading || selectedVenue.status === "approved"}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    selectedVenue.status === "approved"
                      ? "bg-green-500/20 text-green-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {actionLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ThumbsUp className="h-5 w-5" />
                  )}
                  Tasdiqlash
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionLoading || selectedVenue.status === "rejected"}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    selectedVenue.status === "rejected"
                      ? "bg-red-500/20 text-red-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {actionLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ThumbsDown className="h-5 w-5" />
                  )}
                  Rad etish
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <Building className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">To'yxona tanlanmagan</h3>
              <p className="text-gray-400 max-w-md">
                Batafsil ma'lumotlarni ko'rish va tasdiqlash/rad etish uchun chap paneldan to'yxonani tanlang.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">To'yxonalar statistikasi</h2>
          <div className="flex items-center gap-2 bg-[#242b3d] rounded-lg p-1">
            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-1 rounded-md transition-colors ${
                chartType === "pie" ? "bg-[#ff1a75] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <PieChartIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 rounded-md transition-colors ${
                chartType === "bar" ? "bg-[#ff1a75] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Chart */}
          <div className="bg-[#242b3d] rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Status bo'yicha</h3>
            {chartType === "pie" ? (
              <div className="relative h-64">
                <PieChartComponent data={venueStats.statusCounts} />
              </div>
            ) : (
              <div className="h-64">
                <BarChartComponent
                  data={[
                    { name: "Kutilmoqda", value: venueStats.statusCounts.pending, color: "#eab308" },
                    { name: "Tasdiqlangan", value: venueStats.statusCounts.approved, color: "#22c55e" },
                    { name: "Rad etilgan", value: venueStats.statusCounts.rejected, color: "#ef4444" },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Capacity Chart */}
          <div className="bg-[#242b3d] rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Sig'im bo'yicha</h3>
            {chartType === "pie" ? (
              <div className="relative h-64">
                <PieChartComponent data={venueStats.capacityRanges} />
              </div>
            ) : (
              <div className="h-64">
                <BarChartComponent
                  data={[
                    { name: "0-100", value: venueStats.capacityRanges["0-100"], color: "#3b82f6" },
                    { name: "101-300", value: venueStats.capacityRanges["101-300"], color: "#6366f1" },
                    { name: "301-500", value: venueStats.capacityRanges["301-500"], color: "#8b5cf6" },
                    { name: "501+", value: venueStats.capacityRanges["501+"], color: "#a855f7" },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Price Chart */}
          <div className="bg-[#242b3d] rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Narx bo'yicha</h3>
            {chartType === "pie" ? (
              <div className="relative h-64">
                <PieChartComponent data={venueStats.priceRanges} />
              </div>
            ) : (
              <div className="h-64">
                <BarChartComponent
                  data={[
                    { name: "0-20k", value: venueStats.priceRanges["0-20k"], color: "#06b6d4" },
                    { name: "21k-50k", value: venueStats.priceRanges["21k-50k"], color: "#0ea5e9" },
                    { name: "51k-100k", value: venueStats.priceRanges["51k-100k"], color: "#2563eb" },
                    { name: "100k+", value: venueStats.priceRanges["100k+"], color: "#4f46e5" },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// PieChart Component
const PieChartComponent = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)
  if (total === 0) return <div className="flex h-full items-center justify-center text-gray-400">Ma'lumot yo'q</div>

  const colors = {
    pending: "#eab308", // yellow
    approved: "#22c55e", // green
    rejected: "#ef4444", // red
    "0-100": "#3b82f6", // blue
    "101-300": "#6366f1", // indigo
    "301-500": "#8b5cf6", // violet
    "501+": "#a855f7", // purple
    "0-20k": "#06b6d4", // cyan
    "21k-50k": "#0ea5e9", // light blue
    "51k-100k": "#2563eb", // blue
    "100k+": "#4f46e5", // indigo
  }

  const labels = {
    pending: "Kutilmoqda",
    approved: "Tasdiqlangan",
    rejected: "Rad etilgan",
  }

  let cumulativePercent = 0
  const segments = Object.entries(data)
    .map(([key, value]) => {
      if (value === 0) return null
      const percent = (value / total) * 100
      const startPercent = cumulativePercent
      cumulativePercent += percent
      const startAngle = (startPercent / 100) * 360
      const endAngle = (cumulativePercent / 100) * 360
      const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180)
      const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180)
      const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180)
      const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180)
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

      return {
        key,
        value,
        percent,
        path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
        color: colors[key] || "#9ca3af",
        label: labels[key] || key,
      }
    })
    .filter(Boolean)

  return (
    <div className="relative h-full flex flex-col">
      <svg viewBox="0 0 100 100" className="w-full h-48">
        {segments.map((segment, i) => (
          <path key={i} d={segment.path} fill={segment.color} stroke="#242b3d" strokeWidth="0.5" />
        ))}
        <circle cx="50" cy="50" r="20" fill="#242b3d" />
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
            <div className="text-xs">
              <span className="text-white">{segment.label}</span>
              <span className="text-gray-400 ml-1">
                ({segment.value}, {segment.percent.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// BarChart Component
const BarChartComponent = ({ data }) => {
  if (data.length === 0 || data.every((item) => item.value === 0))
    return <div className="flex h-full items-center justify-center text-gray-400">Ma'lumot yo'q</div>

  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-end">
        {data.map((item, i) => {
          const height = item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 5)
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full px-1">
              <div className="relative w-full group">
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-out"
                  style={{ height: `${height}%`, backgroundColor: item.color }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="h-8 mt-2 flex">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center px-1">
            <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: item.color }}></div>
            <div className="text-xs text-gray-400 text-center">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApproveVenueDashboard

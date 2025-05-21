"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import axios from "axios"
import { CheckCircle, XCircle, AlertTriangle, Clock, Building, ChevronDown, ChevronUp, Search, BarChart3, PieChartIcon, RefreshCw, Eye, ThumbsUp, ThumbsDown, Filter } from 'lucide-react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
}

const STATUS_CONFIG = {
  pending: { text: "Kutilmoqda", icon: Clock, color: "#ff1a75", bg: "bg-[#ff1a75]/10" },
  approved: { text: "Tasdiqlangan", icon: CheckCircle, color: "#ff1a75", bg: "bg-[#ff1a75]/10" },
  rejected: { text: "Rad etilgan", icon: XCircle, color: "#ff1a75", bg: "bg-[#ff1a75]/10" },
  default: { text: "Noma'lum", icon: AlertTriangle, color: "#ff1a75", bg: "bg-[#ff1a75]/10" },
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
  const [chartType, setChartType] = useState("pie")
  const navigate = useNavigate()

  // Fetch venues
  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi")

      const { data } = await axios.get("http://localhost:4000/admin/venues", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const formattedData = (Array.isArray(data.venues) ? data.venues : []).map(venue => ({
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
  }, [navigate])

  useEffect(() => {
    fetchVenues()
  }, [fetchVenues])

  // Handle actions
  const handleAction = useCallback(async (action, venueId = selectedVenueId) => {
    if (!venueId) {
      setError("Iltimos, to'yxona tanlang")
      return
    }

    setError(null)
    setActionLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi")

      const endpoint = action === "approve" ? "approve-venue" : "reject-venue"
      const { data } = await axios.put(`http://localhost:4000/admin/${endpoint}/${venueId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(data.message || (action === "approve" ? "Bildirish noma bo'lib tasdiqlandi" : "To'yxona muvaffaqiyatli rad etildi"), {
        duration: 3000,
      })

      await fetchVenues()
      setSelectedVenueId("")
    } catch (error) {
      console.error(`Error ${action === "approve" ? "approving" : "rejecting"} venue:`, error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || `${action === "approve" ? "Tasdiqlashda" : "Rad etishda"} xatolik yuz berdi`
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    } finally {
      setActionLoading(false)
    }
  }, [navigate, selectedVenueId, fetchVenues])

  // Memoized data
  const selectedVenue = useMemo(() => venues.find(venue => venue.id === selectedVenueId) || null, [venues, selectedVenueId])
  const filteredVenues = useMemo(() => venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || venue.status === statusFilter
    return matchesSearch && matchesStatus
  }), [venues, searchTerm, statusFilter])

  const venueStats = useMemo(() => {
    const stats = { pending: 0, approved: 0, rejected: 0, total: venues.length }
    const capacityRanges = { "0-100": 0, "101-300": 0, "301-500": 0, "501+": 0 }
    const priceRanges = { "0-20k": 0, "21k-50k": 0, "51k-100k": 0, "100k+": 0 }

    venues.forEach(venue => {
      if (venue.status in stats) stats[venue.status]++
      else if (venue.status === "kutilmoqda") stats.pending++
      else if (venue.status === "tasdiqlangan") stats.approved++
      else if (venue.status === "rad etilgan") stats.rejected++

      const capacity = Number(venue.capacity)
      if (capacity <= 100) capacityRanges["0-100"]++
      else if (capacity <= 300) capacityRanges["101-300"]++
      else if (capacity <= 500) capacityRanges["301-500"]++
      else capacityRanges["501+"]++

      const price = Number(venue.price_seat)
      if (price <= 20000) priceRanges["0-20k"]++
      else if (price <= 50000) priceRanges["21k-50k"]++
      else if (price <= 100000) priceRanges["51k-100k"]++
      else priceRanges["100k+"]++
    })

    return { statusCounts: stats, capacityRanges, priceRanges }
  }, [venues])

  const getStatusConfig = useCallback((status) => STATUS_CONFIG[status] || STATUS_CONFIG.default, [])

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-[#ffffff]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <Building className="h-6 w-6 text-[#ff1a75]" />
        <h1 className="text-2xl font-bold text-[#333333]">To'yxonalarni tasdiqlash paneli</h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#fee2e2] border border-[#ff1a75] text-[#dc2626] px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Jami to'yxonalar", value: venues.length, icon: Building },
          { label: "Kutilmoqda", value: venueStats.statusCounts.pending, icon: Clock },
          { label: "Tasdiqlangan", value: venueStats.statusCounts.approved, icon: CheckCircle },
          { label: "Rad etilgan", value: venueStats.statusCounts.rejected, icon: XCircle },
        ].map(({ label, value, icon: Icon }, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-[#ffffff] rounded-xl p-4 shadow-lg border border-[#ff1a75]/20 flex items-center justify-between">
            <div>
              <p className="text-[#666666] text-sm">{label}</p>
              <h3 className="text-2xl font-bold text-[#333333]">{value}</h3>
            </div>
            <div className="bg-[#ff1a75]/10 p-3 rounded-full">
              <Icon className="h-6 w-6 text-[#ff1a75]" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Selection Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1 bg-[#ffffff] rounded-xl shadow-lg overflow-hidden border border-[#ff1a75]/20"
        >
          <div className="p-4 border-b border-[#ff1a75]/20">
            <h2 className="text-lg font-semibold text-[#333333] mb-4">To'yxonalar ro'yxati</h2>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#ff1a75]" />
                <input
                  type="text"
                  placeholder="To'yxona nomini qidirish..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#ff1a75] rounded-lg focus:ring-2 focus:ring-[#ff1a75] focus:border-transparent bg-[#ffffff] text-[#333333]"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-[#ff1a75]" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#ff1a75] rounded-lg focus:ring-2 focus:ring-[#ff1a75] focus:border-transparent appearance-none bg-[#ffffff] text-[#333333]"
                >
                  <option value="">Barcha statuslar</option>
                  <option value="pending">Kutilmoqda</option>
                  <option value="approved">Tasdiqlangan</option>
                  <option value="rejected">Rad etilgan</option>
                </select>
              </div>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="h-10 w-10 border-2 border-[#ff1a75] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-10 text-[#666666]">To'yxonalar topilmadi</div>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence>
                  {filteredVenues.map(venue => {
                    const { icon: StatusIcon, ...status } = getStatusConfig(venue.status)
                    return (
                      <motion.li
                        key={venue.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedVenueId === venue.id
                            ? "bg-[#ff1a75]/10 border border-[#ff1a75]/30"
                            : "bg-[#ffffff] hover:bg-[#fff5f7] border border-transparent"
                        }`}
                        onClick={() => setSelectedVenueId(venue.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            <span className="font-medium text-[#333333]">{venue.name}</span>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                            {status.text}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-[#666666] flex justify-between">
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
          <div className="p-4 border-t border-[#ff1a75]/20">
            <button
              onClick={fetchVenues}
              disabled={loading}
              className="w-full py-2 px-4 bg-[#ffffff] hover:bg-[#fff5f7] text-[#ff1a75] rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#ff1a75]"
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
          className="lg:col-span-2 bg-[#ffffff] rounded-xl shadow-lg overflow-hidden border border-[#ff1a75]/20"
        >
          {selectedVenue ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-[#ff1a75]/20 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#333333]">To'yxona ma'lumotlari</h2>
                <button onClick={() => setShowDetails(!showDetails)} className="text-[#ff1a75] hover:text-[#ff1a75]/80 transition-colors">
                  {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    {selectedVenue.images?.length > 0 ? (
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img src={`http://localhost:4000/${selectedVenue.images[0].image_url}`} alt={selectedVenue.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff]/70 to-transparent flex items-end">
                          <div className="p-3 w-full">
                            <div className="flex justify-between items-center">
                              <span className="text-[#333333] font-medium">{selectedVenue.name}</span>
                              <div className={`text-xs px-2 py-1 rounded-full ${getStatusConfig(selectedVenue.status).bg} ${getStatusConfig(selectedVenue.status).color}`}>
                                {getStatusConfig(selectedVenue.status).text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-[#fff5f7] rounded-lg flex items-center justify-center">
                        <Building className="h-12 w-12 text-[#ff1a75]" />
                      </div>
                    )}
                    {selectedVenue.images?.length > 1 && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {selectedVenue.images.slice(1, 5).map((image, idx) => (
                          <div key={idx} className="h-16 rounded-md overflow-hidden">
                            <img src={`http://localhost:4000/${image.image_url}`} alt={`${selectedVenue.name} image ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#333333]">{selectedVenue.name}</h3>
                      <p className="text-[#666666]">{selectedVenue.address || "Manzil ko'rsatilmagan"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Telefon", value: selectedVenue.phone_number || "Ko'rsatilmagan" },
                        { label: "O'rindiqlar", value: selectedVenue.capacity || "0" },
                        { label: "Narxi", value: Number(selectedVenue.price_seat).toLocaleString("uz-UZ") + " so'm" },
                        { label: "Tuman", value: selectedVenue.district?.name || "Ko'rsatilmagan" },
                      ].map(({ label, value }, idx) => (
                        <div key={idx} className="bg-[#fff5f7] p-3 rounded-lg border border-[#ff1a75]/20">
                          <p className="text-[#666666] text-xs">{label}</p>
                          <p className="text-[#333333]">{value}</p>
                        </div>
                      ))}
                    </div>
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="bg-[#fff5f7] p-3 rounded-lg border border-[#ff1a75]/20">
                            <p className="text-[#666666] text-xs">Yaratilgan sana</p>
                            <p className="text-[#333333]">{new Date(selectedVenue.created_at).toLocaleDateString("uz-UZ")}</p>
                          </div>
                          <div className="bg-[#fff5f7] p-3 rounded-lg border border-[#ff1a75]/20">
                            <p className="text-[#666666] text-xs">Qo'shimcha ma'lumot</p>
                            <p className="text-[#333333]">{selectedVenue.description || "Qo'shimcha ma'lumot mavjud emas"}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[#ff1a75]/20 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/venues/${selectedVenue.id}`)}
                  className="flex-1 py-2 px-4 bg-[#ffffff] hover:bg-[#fff5f7] text-[#ff1a75] rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#ff1a75]"
                >
                  <Eye className="h-5 w-5" /> Batafsil ko'rish
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={actionLoading || selectedVenue.status === "approved"}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    selectedVenue.status === "approved" ? "bg-[#ff1a75]/20 text-[#ff1a75]/50 cursor-not-allowed" : "bg-[#ff1a75] hover:bg-[#ff1a75]/80 text-white"
                  }`}
                >
                  {actionLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ThumbsUp className="h-5 w-5" />}
                  Tasdiqlash
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionLoading || selectedVenue.status === "rejected"}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    selectedVenue.status === "rejected" ? "bg-[#ff1a75]/20 text-[#ff1a75]/50 cursor-not-allowed" : "bg-[#ff1a75] hover:bg-[#ff1a75]/80 text-white"
                  }`}
                >
                  {actionLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ThumbsDown className="h-5 w-5" />}
                  Rad etish
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <Building className="h-16 w-16 text-[#ff1a75] mb-4" />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">To'yxona tanlanmagan</h3>
              <p className="text-[#666666] max-w-md">Batafsil ma'lumotlarni ko'rish va tasdiqlash/rad etish uchun chap paneldan to'yxonani tanlang.</p>
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
          <h2 className="text-xl font-semibold text-[#333333]">To'yxonalar statistikasi</h2>
          <div className="flex items-center gap-2 bg-[#ffffff] rounded-lg p-1 border border-[#ff1a75]/20">
            <button onClick={() => setChartType("pie")} className={`px-3 py-1 rounded-md transition-colors ${chartType === "pie" ? "bg-[#ff1a75] text-white" : "text-[#ff1a75] hover:text-[#ff1a75]/80"}`}>
              <PieChartIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setChartType("bar")} className={`px-3 py-1 rounded-md transition-colors ${chartType === "bar" ? "bg-[#ff1a75] text-white" : "text-[#ff1a75] hover:text-[#ff1a75]/80"}`}>
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { title: "Status bo'yicha", data: venueStats.statusCounts },
            { title: "Sig'im bo'yicha", data: venueStats.capacityRanges },
            { title: "Narx bo'yicha", data: venueStats.priceRanges },
          ].map(({ title, data }, idx) => (
            <div key={idx} className="bg-[#ffffff] rounded-xl shadow-lg p-4 border border-[#ff1a75]/20">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">{title}</h3>
              <div className="h-64">{chartType === "pie" ? <PieChartComponent data={data} /> : <BarChartComponent data={Object.entries(data).map(([name, value]) => ({ name, value, color: "#ff1a75" }))} />}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// PieChart Component
const PieChartComponent = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)
  if (total === 0) return <div className="flex h-full items-center justify-center text-[#666666]">Ma'lumot yo'q</div>

  const colors = { pending: "#ff1a75", approved: "#ff1a75", rejected: "#ff1a75", "0-100": "#ff1a75", "101-300": "#ff1a75", "301-500": "#ff1a75", "501+": "#ff1a75", "0-20k": "#ff1a75", "21k-50k": "#ff1a75", "51k-100k": "#ff1a75", "100k+": "#ff1a75" }
  const labels = { pending: "Kutilmoqda", approved: "Tasdiqlangan", rejected: "Rad etilgan" }

  let cumulativePercent = 0
  const segments = Object.entries(data).map(([key, value]) => {
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
    return { key, value, percent, path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`, color: colors[key], label: labels[key] || key }
  }).filter(Boolean)

  return (
    <div className="relative h-full flex flex-col">
      <svg viewBox="0 0 100 100" className="w-full h-48">
        {segments.map((segment, i) => <path key={i} d={segment.path} fill={segment.color} stroke="#ffffff" strokeWidth="0.5" />)}
        <circle cx="50" cy="50" r="20" fill="#ffffff" />
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <div className="text-xs"><span className="text-[#333333]">{segment.label}</span><span className="text-[#666666] ml-1">({segment.value}, {segment.percent.toFixed(1)}%)</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// BarChart Component
const BarChartComponent = ({ data }) => {
  if (!data.length || data.every(item => !item.value)) return <div className="flex h-full items-center justify-center text-[#666666]">Ma'lumot yo'q</div>
  const maxValue = Math.max(...data.map(item => item.value))

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-end">
        {data.map((item, i) => {
          const height = item.value ? Math.max((item.value / maxValue) * 100, 5) : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full px-1">
              <div className="relative w-full group">
                <div className="w-full rounded-t-md" style={{ height: `${height}%`, backgroundColor: item.color }} />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#ffffff] text-[#333333] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#ff1a75]/20">
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
            <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: item.color }} />
            <div className="text-xs text-[#666666] text-center">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApproveVenueDashboard
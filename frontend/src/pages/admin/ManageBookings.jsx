"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import { Calendar, ChevronLeft, ChevronRight, User, MapPin, Phone, Mail, Clock, Building, AlertTriangle, X, Trash2, RefreshCw, Filter, CheckCircle, XCircle, CalendarDays, List } from 'lucide-react'

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

// Status colors
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "tasdiqlangan":
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-300"
    case "kutilmoqda":
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "bekor qilingan":
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300"
    case "bo'lib o'tgan":
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "tasdiqlangan":
    case "confirmed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "kutilmoqda":
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "bekor qilingan":
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "bo'lib o'tgan":
    case "completed":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />
  }
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookingUser, setBookingUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [viewMode, setViewMode] = useState("calendar") // 'calendar' or 'list'
  const navigate = useNavigate()

  // Fetch all bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi")
      }

      const params = {}
      if (statusFilter) params.status = statusFilter

      const response = await axios.get("http://localhost:4000/admin/view-all-bookings", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })

      const data = Array.isArray(response.data) ? response.data : []
      setBookings(data)
      setFilteredBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError(error.response?.data?.error || "Buyurtmalarni yuklashda xatolik yuz berdi")
      toast.error(error.response?.data?.error || "Buyurtmalarni yuklashda xatolik yuz berdi")
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter, navigate])

  // Fetch booking user details
  const fetchBookingUser = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi")
      }

      const response = await axios.get(`http://localhost:4000/user/get-booking-user?booking_id=${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error) {
      console.error("Error fetching booking user:", error)
      toast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi")
      return null
    }
  }

  // Cancel booking
  const handleCancelBooking = async () => {
    if (!selectedBooking?.id) {
      toast.error("Noto'g'ri buyurtma ID si")
      return
    }

    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi")
      }

      const response = await axios.delete(`http://localhost:4000/admin/cancel-booking/${selectedBooking.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(response.data.message || "Buyurtma muvaffaqiyatli bekor qilindi")
      setIsDeleteModalOpen(false)
      setSelectedBooking(null)
      fetchBookings()
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error(error.response?.data?.error || "Buyurtmani bekor qilishda xatolik yuz berdi")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Handle booking click
  const handleBookingClick = async (booking) => {
    setSelectedBooking(booking)
    const userData = await fetchBookingUser(booking.id)
    setBookingUser(userData)
    setIsUserModalOpen(true)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking)
    setIsDeleteModalOpen(true)
  }

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Filter bookings by month
  useEffect(() => {
    if (bookings.length > 0) {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date)
        return bookingDate.getFullYear() === year && bookingDate.getMonth() === month
      })

      setFilteredBookings(filtered)
    }
  }, [bookings, currentDate])

  // Calendar navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and last day of month
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    
    // Adjust for Monday as first day of week
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Get total days in month
    const daysInMonth = lastDayOfMonth.getDate()

    // Create array for all days in calendar view
    const calendarDays = []

    // Add empty cells for days before first day of month
    for (let i = 0; i < adjustedFirstDayOfWeek; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false })
    }

    // Add cells for all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({ day, isCurrentMonth: true })
    }

    // Add empty cells to complete the last week if needed
    const remainingCells = 7 - (calendarDays.length % 7)
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        calendarDays.push({ day: null, isCurrentMonth: false })
      }
    }

    return calendarDays
  }

  // Get bookings for a specific day
  const getBookingsForDay = (day) => {
    if (!day) return []

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, day)
    
    // Format date as YYYY-MM-DD for comparison
    const formattedDate = date.toISOString().split("T")[0]

    return filteredBookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0]
      return bookingDate === formattedDate
    })
  }

  // Format date for display
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long" }
    return date.toLocaleDateString("uz-UZ", options)
  }

  // Get day of week names
  const getDayNames = () => {
    return ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"]
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">Buyurtmalar kalendari</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "calendar"
                ? "bg-pink-100 text-pink-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <CalendarDays className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-50 rounded-xl shadow-lg p-4 mb-6 border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 min-w-[180px] text-center">
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              >
                <option value="">Barcha statuslar</option>
                <option value="tasdiqlangan">Tasdiqlangan</option>
                <option value="kutilmoqda">Kutilmoqda</option>
                <option value="bekor qilingan">Bekor qilingan</option>
                <option value="bo'lib o'tgan">Bo'lib o'tgan</option>
              </select>
            </div>

            <button
              onClick={() => fetchBookings()}
              className="p-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
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

      {loading && bookings.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
            <div
              className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-300 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === "calendar" ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Calendar Header - Days of Week */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {getDayNames().map((day, index) => (
                  <div
                    key={index}
                    className="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 auto-rows-fr">
                {generateCalendarDays().map((calendarDay, index) => {
                  const dayBookings = calendarDay.day ? getBookingsForDay(calendarDay.day) : []
                  const isToday =
                    calendarDay.isCurrentMonth &&
                    calendarDay.day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear()

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-1 border-r border-b border-gray-200 last:border-r-0 ${
                        calendarDay.isCurrentMonth ? "bg-white" : "bg-gray-50"
                      } ${isToday ? "bg-pink-50" : ""}`}
                    >
                      {calendarDay.day && (
                        <>
                          <div
                            className={`text-right p-1 font-medium ${
                              isToday
                                ? "text-pink-600 bg-pink-100 rounded-full w-7 h-7 flex items-center justify-center ml-auto"
                                : "text-gray-700"
                            }`}
                          >
                            {calendarDay.day}
                          </div>
                          <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                            {dayBookings.map((booking) => (
                              <div
                                key={booking.id}
                                onClick={() => handleBookingClick(booking)}
                                className={`px-2 py-1 text-xs rounded cursor-pointer flex items-center gap-1 ${getStatusColor(
                                  booking.status,
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                <span className="truncate">{booking.venue_name || "Noma'lum"}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        To'yxona
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Foydalanuvchi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sana
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Buyurtmalar topilmadi
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.venue_name || "Noma'lum"}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => handleBookingClick(booking)}
                          >
                            {booking.user_name || "Noma'lum"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString("uz-UZ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusColor(
                                booking.status,
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              {booking.status || "Noma'lum"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDeleteClick(booking)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              disabled={booking.status === "bekor qilingan" || booking.status === "bo'lib o'tgan"}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Buyurtma ma'lumotlari</h3>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="h-5 w-5 text-pink-500" />
                    <h4 className="font-medium text-gray-800">To'yxona ma'lumotlari</h4>
                  </div>
                  <div className="ml-8 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Nomi:</span> {selectedBooking?.venue_name || "Noma'lum"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Sana:</span>{" "}
                      {selectedBooking?.date
                        ? new Date(selectedBooking.date).toLocaleDateString("uz-UZ")
                        : "Noma'lum"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedBooking?.status)}`}>
                        {selectedBooking?.status || "Noma'lum"}
                      </span>
                    </p>
                  </div>
                </div>

                {bookingUser ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-pink-500" />
                      <h4 className="font-medium text-gray-800">Foydalanuvchi ma'lumotlari</h4>
                    </div>
                    <div className="ml-8 space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Ism:</span> {bookingUser.name || "Noma'lum"}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {bookingUser.phone || "Noma'lum"}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        {bookingUser.email || "Noma'lum"}
                      </p>
                      <p className="text-gray-700 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        {bookingUser.address || "Noma'lum"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Foydalanuvchi ma'lumotlari mavjud emas
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Buyurtmani bekor qilish</h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-4 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                  <p>
                    <span className="font-semibold">{selectedBooking?.venue_name}</span> to'yxonasiga{" "}
                    <span className="font-semibold">
                      {selectedBooking?.date
                        ? new Date(selectedBooking.date).toLocaleDateString("uz-UZ")
                        : "Noma'lum"}
                    </span>{" "}
                    sanasidagi buyurtmani bekor qilishni tasdiqlaysizmi?
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={deleteLoading}
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Jarayonda...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Bekor qilish
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageBookings

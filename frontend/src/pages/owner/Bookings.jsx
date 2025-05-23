"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import { format, isSameDay, isPast, isFuture } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Users, Phone, Clock, Search, Filter, User } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"

// Tashkent districts array
const tashkentDistricts = [
  "Bektemir tumani",
  "Chilonzor tumani",
  "Mirobod tumani",
  "Mirzo Ulugbek tumani",
  "Olmazar tumani",
  "Sergeli tumani",
  "Shayxontohur tumani",
  "Uchtepa tumani",
  "Yakkasaray tumani",
  "Yashnobod tumani",
  "Yunusobod tumani",
]

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filteredBookings, setFilteredBookings] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [activeTab, setActiveTab] = useState("calendar")  
  const [searchTerm, setSearchTerm] = useState("")
  const [showBookingDetails, setShowBookingDetails] = useState(null)

  // Token va user ma'lumotlarini olish (xatoliklarni oldini olish)
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
  const user = typeof window !== 'undefined' && localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : { id: null }
  const userId = user?.id

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      setError(null)
      
      if (!token || !userId) {
        setError("Token yoki foydalanuvchi ma'lumotlari topilmadi")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`http://localhost:4000/owner/view-venue-booking/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("API Response:", response.data) // Debug uchun

        // API dan kelgan ma'lumotni to'g'ri olish
        let bookingsData = []
        
        if (response.data) {
          // Turli formatlarni qo'llab-quvvatlash
          if (Array.isArray(response.data)) {
            bookingsData = response.data
          } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
            bookingsData = response.data.bookings
          } else if (response.data.data && Array.isArray(response.data.data)) {
            bookingsData = response.data.data
          } else if (typeof response.data === 'object' && response.data !== null) {
            // Agar object bo'lsa, uni array ga aylantirish
            bookingsData = [response.data]
          }
        }

        // Ma'lumotlarni tekshirish va formatlash
        const formattedBookings = bookingsData.map(booking => ({
          ...booking,
          booking_id: booking.booking_id || booking.id || booking._id || Date.now(),
          venue_name: booking.venue_name || booking.name || 'Noma\'lum joy',
          reservation_date: booking.reservation_date || booking.date || booking.booking_date,
          guest_count: booking.guest_count || booking.guests || booking.people_count || 0,
          firstname: booking.firstname || booking.first_name || booking.client_name || '',
          lastname: booking.lastname || booking.last_name || '',
          client_phone: booking.client_phone || booking.phone || booking.contact || '',
          status: booking.status || 'pending'
        }))

        setBookings(formattedBookings)
        
      } catch (error) {
        console.error("Error fetching bookings:", error)
        setError(error.response?.data?.message || error.message || "Ma'lumotlarni yuklashda xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [token, userId])

  // Filter bookings when selected date changes
  useEffect(() => {
    if (Array.isArray(bookings) && bookings.length > 0 && selectedDate) {
      const filtered = bookings.filter((booking) => {
        if (!booking.reservation_date) return false
        try {
          return isSameDay(new Date(booking.reservation_date), selectedDate)
        } catch (e) {
          console.warn("Invalid date:", booking.reservation_date)
          return false
        }
      })
      setFilteredBookings(filtered)
    } else {
      setFilteredBookings([])
    }
  }, [selectedDate, bookings])

  // Get upcoming bookings (faqat array bo'lsa)
  const upcomingBookings = Array.isArray(bookings) 
    ? bookings.filter((booking) => {
        if (!booking.reservation_date) return false
        try {
          return isFuture(new Date(booking.reservation_date))
        } catch {
          return false
        }
      })
    : []

  // Get past bookings (faqat array bo'lsa)
  const pastBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        if (!booking.reservation_date) return false
        try {
          const bookingDate = new Date(booking.reservation_date)
          return isPast(bookingDate) && !isSameDay(bookingDate, new Date())
        } catch {
          return false
        }
      })
    : []

  // Get today's bookings (faqat array bo'lsa)
  const todayBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        if (!booking.reservation_date) return false
        try {
          return isSameDay(new Date(booking.reservation_date), new Date())
        } catch {
          return false
        }
      })
    : []

  // Custom rendering for calendar dates to highlight dates with bookings
  const renderDayContents = (day, date) => {
    if (!Array.isArray(bookings)) return <div className="flex items-center justify-center h-8 w-8">{day}</div>
    
    const hasBooking = bookings.some((booking) => {
      if (!booking.reservation_date) return false
      try {
        return isSameDay(new Date(booking.reservation_date), date)
      } catch {
        return false
      }
    })

    const isPastBooking = hasBooking && isPast(date) && !isSameDay(date, new Date())
    const isFutureBooking = hasBooking && isFuture(date)
    const isTodayBooking = hasBooking && isSameDay(date, new Date())

    return (
      <div
        className={`relative flex items-center justify-center h-8 w-8 ${hasBooking ? "font-bold" : ""} ${
          isSameDay(date, selectedDate) ? "text-white" : ""
        }`}
      >
        {day}
        {hasBooking && (
          <div
            className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full ${
              isPastBooking ? "bg-gray-400" : isFutureBooking ? "bg-emerald-500" : "bg-purple-500"
            }`}
          />
        )}
      </div>
    )
  }

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          text: "Tasdiqlangan",
          icon: <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>,
        }
      case "pending":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          text: "Kutilmoqda",
          icon: <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>,
        }
      case "cancelled":
        return {
          color: "bg-rose-100 text-rose-800 border-rose-200",
          text: "Bekor qilingan",
          icon: <div className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></div>,
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: status || "Noma'lum",
          icon: <div className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></div>,
        }
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Noma'lum sana"
    try {
      const date = new Date(dateString)
      return format(date, "dd.MM.yyyy")
    } catch {
      return "Noto'g'ri sana"
    }
  }

  // Handle booking card click
  const handleBookingCardClick = (booking) => {
    setShowBookingDetails(booking)
  }

  // Close booking details modal
  const closeBookingDetails = () => {
    setShowBookingDetails(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bronlar Boshqaruvi</h1>
            <p className="text-gray-500">Barcha bronlaringizni bir joyda boshqaring</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Qidirish..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <button className="bg-white p-2.5 rounded-full shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Bugungi bronlar</p>
                <h3 className="text-2xl font-bold mt-1">{todayBookings.length}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Kelasi bronlar</p>
                <h3 className="text-2xl font-bold mt-1">{upcomingBookings.length}</h3>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Jami bronlar</p>
                <h3 className="text-2xl font-bold mt-1">{Array.isArray(bookings) ? bookings.length : 0}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "calendar"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            Kalendar ko'rinishi
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "list"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Ro'yxat ko'rinishi
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 p-4 rounded-lg text-center mb-6">
            <p className="font-medium">Xatolik yuz berdi:</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded text-sm"
            >
              Qaytadan yuklash
            </button>
          </div>
        )}

        {!loading && !error && activeTab === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Kalendar
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="inline-block h-2.5 w-2.5 bg-emerald-500 rounded-full mr-1.5"></span>
                    Kelasi bronlar
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block h-2.5 w-2.5 bg-gray-400 rounded-full mr-1.5"></span>
                    O'tgan bronlar
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block h-2.5 w-2.5 bg-purple-500 rounded-full mr-1.5"></span>
                    Bugungi bronlar
                  </div>
                </div>
              </div>

              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                renderDayContents={renderDayContents}
                calendarClassName="w-full"
                wrapperClassName="w-full"
                previousMonthButtonLabel={<ChevronLeft className="h-4 w-4" />}
                nextMonthButtonLabel={<ChevronRight className="h-4 w-4" />}
                dayClassName={(date) =>
                  isSameDay(date, selectedDate)
                    ? "bg-purple-600 text-white rounded-full hover:bg-purple-700"
                    : undefined
                }
              />
            </div>

            {/* Selected Date Bookings */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {format(selectedDate, "dd.MM.yyyy")} sanasidagi bronlar
              </h2>

              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Calendar className="h-16 w-16 mb-4 text-gray-300" />
                  <p>Bu sana uchun bronlar mavjud emas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.status)
                    return (
                      <div
                        key={booking.booking_id || Math.random()}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleBookingCardClick(booking)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{booking.venue_name || "Noma'lum joy"}</h3>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1.5" />
                              {booking.guest_count || 0} mehmon
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${statusInfo.color} flex items-center`}
                          >
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-1.5 text-gray-400" />
                            {`${booking.firstname || ""} ${booking.lastname || ""}`.trim() || "Noma'lum"}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                            {booking.client_phone || "Noma'lum"}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && activeTab === "list" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {!Array.isArray(bookings) || bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Calendar className="h-16 w-16 mb-4 text-gray-300" />
                <p>Bronlar mavjud emas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Joy nomi
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
                        Mijoz
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mehmonlar
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Holati
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking, index) => {
                      const statusInfo = getStatusInfo(booking.status)
                      return (
                        <tr
                          key={booking.booking_id || index}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            booking.reservation_date && isSameDay(new Date(booking.reservation_date), selectedDate) ? "bg-purple-50" : ""
                          }`}
                          onClick={() => {
                            if (booking.reservation_date) {
                              setSelectedDate(new Date(booking.reservation_date))
                              setActiveTab("calendar")
                            }
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.venue_name || "Noma'lum joy"}</div>
                            <div className="text-xs text-gray-500">ID: {booking.booking_id || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(booking.reservation_date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {`${booking.firstname || ""} ${booking.lastname || ""}`.trim() || "Noma'lum"}
                            </div>
                            <div className="text-xs text-gray-500">{booking.client_phone || "Noma'lum"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guest_count || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs border ${statusInfo.color} flex items-center w-fit`}
                            >
                              {statusInfo.icon}
                              {statusInfo.text}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Bron ma'lumotlari</h2>
                <button onClick={closeBookingDetails} className="text-gray-400 hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg text-gray-800">{showBookingDetails.venue_name || "Noma'lum joy"}</h3>
                  <p className="text-sm text-gray-500 mt-1">Bron ID: {showBookingDetails.booking_id || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Bron ma'lumotlari</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Sana</p>
                        <p className="text-sm text-gray-600">{formatDate(showBookingDetails.reservation_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Mehmonlar soni</p>
                        <p className="text-sm text-gray-600">{showBookingDetails.guest_count || 0} kishi</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-400 mr-3 mt-0.5">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            showBookingDetails.status === "confirmed"
                              ? "bg-emerald-500"
                              : showBookingDetails.status === "pending"
                                ? "bg-amber-500"
                                : showBookingDetails.status === "cancelled"
                                  ? "bg-rose-500"
                                  : "bg-gray-500"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Holati</p>
                        <p className="text-sm text-gray-600">{getStatusInfo(showBookingDetails.status).text}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Mijoz ma'lumotlari</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Mijoz ismi</p>
                        <p className="text-sm text-gray-600">
                          {`${showBookingDetails.firstname || ""} ${showBookingDetails.lastname || ""}`.trim() ||
                            "Noma'lum"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Telefon raqami</p>
                        <p className="text-sm text-gray-600">{showBookingDetails.client_phone || "Noma'lum"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  onClick={closeBookingDetails}
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
  export default Bookings
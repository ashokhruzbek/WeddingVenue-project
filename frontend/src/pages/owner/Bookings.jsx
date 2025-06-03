"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format, isSameDay, isPast, isFuture } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Phone,
  Clock,
  Search,
  Filter,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Sparkles,
  Crown,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [activeTab, setActiveTab] = useState("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookingDetails, setShowBookingDetails] = useState(null);

  // Token va user ma'lumotlarini olish
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : { id: null };
  const userId = user?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      if (!token || !userId) {
        setError("Token yoki foydalanuvchi ma'lumotlari topilmadi");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `api/owner/view-venue-booking/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        let bookingsData = [];

        if (response.data) {
          if (Array.isArray(response.data)) {
            bookingsData = response.data;
          } else if (
            response.data.bookings &&
            Array.isArray(response.data.bookings)
          ) {
            bookingsData = response.data.bookings;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            bookingsData = response.data.data;
          } else if (
            typeof response.data === "object" &&
            response.data !== null
          ) {
            bookingsData = [response.data];
          }
        }

        const formattedBookings = bookingsData.map((booking) => ({
          ...booking,
          booking_id:
            booking.booking_id || booking.id || booking._id || Date.now(),
          venue_name: booking.venue_name || booking.name || "Noma'lum joy",
          reservation_date:
            booking.reservation_date || booking.date || booking.booking_date,
          guest_count:
            booking.guest_count || booking.guests || booking.people_count || 0,
          firstname:
            booking.firstname ||
            booking.first_name ||
            booking.client_name ||
            "",
          lastname: booking.lastname || booking.last_name || "",
          client_phone:
            booking.client_phone || booking.phone || booking.contact || "",
          status: booking.status || "pending",
        }));

        setBookings(formattedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Ma'lumotlarni yuklashda xatolik yuz berdi"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, userId]);

  useEffect(() => {
    if (Array.isArray(bookings) && bookings.length > 0 && selectedDate) {
      const filtered = bookings.filter((booking) => {
        if (!booking.reservation_date) return false;
        try {
          return isSameDay(new Date(booking.reservation_date), selectedDate);
        } catch (e) {
          console.warn("Invalid date:", booking.reservation_date);
          return false;
        }
      });
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings([]);
    }
  }, [selectedDate, bookings]);

  const upcomingBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        if (!booking.reservation_date) return false;
        try {
          return isFuture(new Date(booking.reservation_date));
        } catch {
          return false;
        }
      })
    : [];

  const pastBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        if (!booking.reservation_date) return false;
        try {
          const bookingDate = new Date(booking.reservation_date);
          return isPast(bookingDate) && !isSameDay(bookingDate, new Date());
        } catch {
          return false;
        }
      })
    : [];

  const todayBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        if (!booking.reservation_date) return false;
        try {
          return isSameDay(new Date(booking.reservation_date), new Date());
        } catch {
          return false;
        }
      })
    : [];

  const renderDayContents = (day, date) => {
    if (!Array.isArray(bookings))
      return (
        <div className="flex items-center justify-center h-8 w-8">{day}</div>
      );

    const hasBooking = bookings.some((booking) => {
      if (!booking.reservation_date) return false;
      try {
        return isSameDay(new Date(booking.reservation_date), date);
      } catch {
        return false;
      }
    });

    const isPastBooking =
      hasBooking && isPast(date) && !isSameDay(date, new Date());
    const isFutureBooking = hasBooking && isFuture(date);
    const isTodayBooking = hasBooking && isSameDay(date, new Date());

    return (
      <div
        className={`relative flex items-center justify-center h-8 w-8 ${
          hasBooking ? "font-bold" : ""
        } ${isSameDay(date, selectedDate) ? "text-white" : ""}`}
      >
        {day}
        {hasBooking && (
          <div
            className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full ${
              isPastBooking
                ? "bg-gray-400"
                : isFutureBooking
                ? "bg-emerald-500"
                : "bg-pink-500"
            }`}
          />
        )}
      </div>
    );
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return {
          color:
            "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200",
          text: "Tasdiqlangan",
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
        };
      case "pending":
        return {
          color:
            "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200",
          text: "Kutilmoqda",
          icon: <Clock className="w-4 h-4 text-amber-600" />,
        };
      case "cancelled":
        return {
          color:
            "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-200",
          text: "Bekor qilingan",
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
        };
      default:
        return {
          color:
            "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200",
          text: status || "Noma'lum",
          icon: <AlertCircle className="w-4 h-4 text-gray-600" />,
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Noma'lum sana";
    try {
      const date = new Date(dateString);
      return format(date, "dd.MM.yyyy");
    } catch {
      return "Noto'g'ri sana";
    }
  };

  const handleBookingCardClick = (booking) => {
    setShowBookingDetails(booking);
  };

  const closeBookingDetails = () => {
    setShowBookingDetails(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
            <Heart className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
            💕 Bronlar yuklanmoqda...
          </p>
          <div className="flex justify-center mt-4 space-x-1">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-100/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-rose-100/50 rounded-full blur-xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 py-12">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full mr-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <Sparkles className="w-5 h-5 text-white absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    💒 Bronlar Boshqaruvi
                  </h1>
                  <p className="text-lg text-pink-100 mt-2">
                    Barcha bronlaringizni bir joyda boshqaring
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Qidirish..."
                  className="pl-12 pr-4 py-3 rounded-xl border-0 bg-white/20 backdrop-blur-sm text-white placeholder-pink-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-pink-100" />
              </div>

              <button className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/20">
                <Filter className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-pink-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    💕 Bugungi bronlar
                  </p>
                  <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    {todayBookings.length}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-emerald-600">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>Bugun</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400"></div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-pink-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    🌟 Kelasi bronlar
                  </p>
                  <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                    {upcomingBookings.length}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-emerald-600">
                    <Sparkles className="w-4 h-4 mr-1" />
                    <span>Kelajak</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-green-400 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-400"></div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-pink-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    👑 Jami bronlar
                  </p>
                  <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {Array.isArray(bookings) ? bookings.length : 0}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-purple-600">
                    <Crown className="w-4 h-4 mr-1" />
                    <span>Barcha</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400"></div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">
                  ⚠️ Xatolik yuz berdi:
                </p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              🔄 Qaytadan yuklash
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-100 p-2 mb-8 inline-flex">
          <button
            className={`px-6 py-3 font-medium text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${
              activeTab === "calendar"
                ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg transform scale-105"
                : "text-gray-500 hover:text-gray-700 hover:bg-pink-50"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="w-4 h-4" />
            📅 Kalendar ko'rinishi
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${
              activeTab === "list"
                ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg transform scale-105"
                : "text-gray-500 hover:text-gray-700 hover:bg-pink-50"
            }`}
            onClick={() => setActiveTab("list")}
          >
            <Users className="w-4 h-4" />
            📋 Ro'yxat ko'rinishi
          </button>
        </div>

        {!error && activeTab === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100">
              <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800 mb-4">
                  <div className="p-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  📅 Kalendar
                </h2>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center p-3 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                    <span className="inline-block h-3 w-3 bg-emerald-500 rounded-full mr-3"></span>
                    <span className="text-emerald-700 font-medium">
                      🌟 Kelasi bronlar
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <span className="inline-block h-3 w-3 bg-gray-400 rounded-full mr-3"></span>
                    <span className="text-gray-700 font-medium">
                      📅 O'tgan bronlar
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg border-2 border-pink-200">
                    <span className="inline-block h-3 w-3 bg-pink-500 rounded-full mr-3"></span>
                    <span className="text-pink-700 font-medium">
                      💕 Bugungi bronlar
                    </span>
                  </div>
                </div>
              </div>

              <div className="calendar-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  renderDayContents={renderDayContents}
                  calendarClassName="w-full custom-calendar"
                  wrapperClassName="w-full"
                  previousMonthButtonLabel={<ChevronLeft className="h-4 w-4" />}
                  nextMonthButtonLabel={<ChevronRight className="h-4 w-4" />}
                  dayClassName={(date) =>
                    isSameDay(date, selectedDate)
                      ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full hover:from-pink-500 hover:to-rose-500"
                      : "hover:bg-pink-50 rounded-full transition-colors duration-200"
                  }
                />
              </div>
            </div>

            {/* Selected Date Bookings */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  📅 {format(selectedDate, "dd.MM.yyyy")} sanasidagi bronlar
                </h2>
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2 rounded-full border-2 border-pink-200">
                  <span className="text-pink-700 font-semibold text-sm">
                    💕 {filteredBookings.length} ta bron
                  </span>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="relative p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-full mb-4">
                    <Calendar className="h-16 w-16 text-pink-300" />
                    <Heart className="h-6 w-6 text-pink-400 absolute -top-1 -right-1" />
                  </div>
                  <p className="text-lg font-medium text-gray-500">
                    💔 Bu sana uchun bronlar mavjud emas
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Boshqa sanani tanlang
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking, index) => {
                    const statusInfo = getStatusInfo(booking.status);
                    return (
                      <div
                        key={booking.booking_id || Math.random()}
                        className="group bg-gradient-to-r from-white to-pink-50 border-2 border-pink-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-pink-300"
                        onClick={() => handleBookingCardClick(booking)}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeInUp 0.5s ease-out forwards",
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition-colors duration-300 flex items-center gap-2">
                              <Crown className="w-5 h-5 text-pink-500" />
                              {booking.venue_name || "Noma'lum joy"}
                            </h3>
                            <div className="flex items-center mt-2 text-gray-600">
                              <Users className="h-4 w-4 mr-2 text-rose-500" />
                              <span className="font-medium">
                                👥 {booking.guest_count || 0} mehmon
                              </span>
                            </div>
                          </div>
                          <div
                            className={`px-4 py-2 rounded-xl border-2 ${statusInfo.color} flex items-center gap-2 shadow-sm`}
                          >
                            {statusInfo.icon}
                            <span className="font-medium text-sm">
                              {statusInfo.text}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pink-100">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 text-pink-500" />
                            <span className="text-sm font-medium">
                              👤{" "}
                              {`${booking.firstname || ""} ${
                                booking.lastname || ""
                              }`.trim() || "Noma'lum"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm">
                              📱 {booking.client_phone || "Noma'lum"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!error && activeTab === "list" && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-100 overflow-hidden">
            {!Array.isArray(bookings) || bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8">
                <div className="relative p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-full mb-4">
                  <Calendar className="h-16 w-16 text-pink-300" />
                  <Heart className="h-6 w-6 text-pink-400 absolute -top-1 -right-1" />
                </div>
                <p className="text-lg font-medium text-gray-500">
                  💔 Bronlar mavjud emas
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Hozircha hech qanday bron yo'q
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-pink-200">
                  <thead className="bg-gradient-to-r from-pink-50 to-rose-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        🏰 Joy nomi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        📅 Sana
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        👤 Mijoz
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        👥 Mehmonlar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        📊 Holati
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-pink-100">
                    {bookings.map((booking, index) => {
                      const statusInfo = getStatusInfo(booking.status);
                      return (
                        <tr
                          key={booking.booking_id || index}
                          className={`hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 cursor-pointer transition-all duration-300 ${
                            booking.reservation_date &&
                            isSameDay(
                              new Date(booking.reservation_date),
                              selectedDate
                            )
                              ? "bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-400"
                              : ""
                          }`}
                          onClick={() => {
                            if (booking.reservation_date) {
                              setSelectedDate(
                                new Date(booking.reservation_date)
                              );
                              setActiveTab("calendar");
                            }
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Crown className="w-4 h-4 text-pink-500" />
                              {booking.venue_name || "Noma'lum joy"}
                            </div>
                            <div className="text-xs text-gray-500 bg-pink-100 px-2 py-1 rounded-full inline-block mt-1">
                              ID: {booking.booking_id || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              📅 {formatDate(booking.reservation_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                              <User className="w-4 h-4 text-pink-500" />
                              {`${booking.firstname || ""} ${
                                booking.lastname || ""
                              }`.trim() || "Noma'lum"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {booking.client_phone || "Noma'lum"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-rose-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                👥 {booking.guest_count || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`px-3 py-2 rounded-xl border-2 ${statusInfo.color} flex items-center gap-2 w-fit`}
                            >
                              {statusInfo.icon}
                              <span className="font-medium text-xs">
                                {statusInfo.text}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-pink-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-pink-500" />
                    💒 Bron ma'lumotlari
                  </h2>
                  <p className="text-gray-500 mt-1">Batafsil ma'lumotlar</p>
                </div>
                <button
                  onClick={closeBookingDetails}
                  className="p-2 hover:bg-pink-50 rounded-full transition-colors duration-200"
                >
                  <XCircle className="h-6 w-6 text-gray-400 hover:text-pink-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border-2 border-pink-200">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-pink-500" />
                    {showBookingDetails.venue_name || "Noma'lum joy"}
                  </h3>
                  <div className="bg-white px-3 py-1 rounded-full inline-block">
                    <p className="text-sm text-gray-600">
                      Bron ID:{" "}
                      <span className="font-mono font-medium">
                        {showBookingDetails.booking_id || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-pink-600" />
                    📅 Bron ma'lumotlari
                  </h4>
                  <div className="bg-pink-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-pink-100">
                      <Calendar className="h-6 w-6 text-pink-500 mr-4 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          📅 Sana
                        </p>
                        <p className="text-lg text-gray-600 font-medium">
                          {formatDate(showBookingDetails.reservation_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-pink-100">
                      <Users className="h-6 w-6 text-rose-500 mr-4 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          👥 Mehmonlar soni
                        </p>
                        <p className="text-lg text-gray-600 font-medium">
                          {showBookingDetails.guest_count || 0} kishi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-pink-100">
                      {getStatusInfo(showBookingDetails.status).icon}
                      <div className="ml-4">
                        <p className="text-sm font-bold text-gray-800">
                          📊 Holati
                        </p>
                        <div
                          className={`px-3 py-1 rounded-lg border-2 ${
                            getStatusInfo(showBookingDetails.status).color
                          } inline-block mt-1`}
                        >
                          <p className="text-sm font-medium">
                            {getStatusInfo(showBookingDetails.status).text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    👤 Mijoz ma'lumotlari
                  </h4>
                  <div className="bg-green-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-green-100">
                      <User className="h-6 w-6 text-green-500 mr-4 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          👤 Mijoz ismi
                        </p>
                        <p className="text-lg text-gray-600 font-medium">
                          {`${showBookingDetails.firstname || ""} ${
                            showBookingDetails.lastname || ""
                          }`.trim() || "Noma'lum"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-green-100">
                      <Phone className="h-6 w-6 text-indigo-500 mr-4 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          📱 Telefon raqami
                        </p>
                        <p className="text-lg text-gray-600 font-medium">
                          {showBookingDetails.client_phone || "Noma'lum"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  onClick={closeBookingDetails}
                >
                  <Heart className="w-5 h-5" />
                  💕 Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-calendar {
          width: 240px !important;
        }

        .custom-calendar .react-datepicker__header {
          background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
          border: none;
          border-radius: 12px 12px 0 0;
        }

        .custom-calendar .react-datepicker__current-month {
          color: white;
          font-weight: bold;
        }

        .custom-calendar .react-datepicker__day-name {
          color: white;
          font-weight: 600;
        }

        .custom-calendar .react-datepicker__navigation {
          display: block !important;
        }

        .custom-calendar .react-datepicker__navigation--previous {
          left: 12px;
        }

        .custom-calendar .react-datepicker__navigation--next {
          right: 12px;
        }
      `}</style>
    </div>
  );
}

export default Bookings;

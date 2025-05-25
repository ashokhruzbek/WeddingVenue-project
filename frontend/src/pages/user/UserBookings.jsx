"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Calendar, Users, Phone, CheckCircle, AlertCircle, MapPin, Clock, Heart, Sparkles, Star } from "lucide-react"

function UserBookings() {
  const [venues, setVenues] = useState([])
  const [formData, setFormData] = useState({
    venue_id: "",
    reservation_date: null,
    guest_count: "",
    client_phone: "",
    status: "endi bo`ladigan",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchingVenues, setFetchingVenues] = useState(true)

  // Token va user_id ni olish
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const user =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : { id: null }
  const userId = user?.id

  // To'yxonalarni olish
  useEffect(() => {
    const fetchVenues = async () => {
      setFetchingVenues(true)
      try {
        const response = await axios.get("http://localhost:4000/venues")
         setVenues(response.data.venues)
      } catch (err) {
        console.error("To'yxonalarni yuklashda xatolik:", err)
        setError(err.response?.data?.error || "To'yxonalarni yuklashda xatolik yuz berdi")
        setVenues([])
      } finally {
        setFetchingVenues(false)
      }
    }

    if (token && userId) {
      fetchVenues()
    } else {
      setError("Tizimga kirish uchun token topilmadi")
      setVenues([])
      setFetchingVenues(false)
    }
  }, [token, userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      reservation_date: date,
    }))
  }

  const validateForm = () => {
    if (!formData.venue_id) return "To'yxona tanlanmadi"
    if (!formData.reservation_date) return "Bron sanasi tanlanmadi"
    if (!formData.guest_count || formData.guest_count <= 0) return "Mehmonlar soni noto'g'ri"
    if (!formData.client_phone || !/^\+998\d{9}$/.test(formData.client_phone))
      return "Telefon raqami noto'g'ri formatda (masalan: +998901234567)"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError, {
        position: "top-right",
        autoClose: 3000,
      })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/user/add-booking/${userId}`,
        {
          venue_id: Number(formData.venue_id),
          reservation_date: formData.reservation_date.toISOString().split("T")[0],
          guest_count: Number(formData.guest_count),
          client_phone: formData.client_phone,
          status: formData.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log(response);
      

      toast.success("Bron muvaffaqiyatli qo'shildi!", {
        position: "top-right",
        autoClose: 3000,
      })

      // Formani tozalash
      setFormData({
        venue_id: "",
        reservation_date: null,
        guest_count: "",
        client_phone: "",
        status: "endi bo`ladigan",
      })
    } catch (err) {
      console.error("Bron qo'shishda xatolik:", err)
      const errorMessage = err.response?.data?.error || "Bron qo'shishda xatolik yuz berdi"
      setError(errorMessage)
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingVenues) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
            <Heart className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">To'yxonalar yuklanmoqda...</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      <ToastContainer />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-200/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-100/50 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-rose-100/60 rounded-full blur-xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 py-12">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-white absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">💕 Yangi Bron Qo'shish</h1>
            <p className="text-lg text-pink-100 max-w-2xl mx-auto">
              Orzularingizni amalga oshirish uchun eng yaxshi to'yxonani tanlang
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium text-sm">Xatolik yuz berdi:</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-pink-400 to-rose-400 px-6 py-4">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-white mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Bron Ma'lumotlari</h2>
                    <p className="text-pink-100 text-sm">Barcha maydonlarni to'ldiring</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* To'yxona tanlash */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                    To'yxona tanlang
                  </label>
                  <select
                    name="venue_id"
                    value={formData.venue_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white"
                    disabled={venues.length === 0}
                  >
                    <option value="">💒 To'yxona tanlang</option>
                    {venues.length > 0 ? (
                      venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} (Sig'im:🚹 {venue.capacity} kishi)
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        To'yxonalar mavjud emas
                      </option>
                    )}
                  </select>
                  {venues.length === 0 && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Hozirda tasdiqlangan to'yxonalar mavjud emas
                    </p>
                  )}
                </div>

                {/* Bron sanasi va Mehmonlar soni */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-rose-500" />
                      Bron sanasi
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.reservation_date}
                        onChange={handleDateChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                        dateFormat="dd.MM.yyyy"
                        placeholderText="📅 Sanani tanlang"
                        minDate={new Date()}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-pink-500" />
                      Mehmonlar soni
                    </label>
                    <input
                      type="number"
                      name="guest_count"
                      value={formData.guest_count}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                      placeholder="👥 Mehmonlar soni"
                      min="1"
                    />
                  </div>
                </div>

                {/* Telefon va Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-rose-500" />
                      Telefon raqami
                    </label>
                    <input
                      type="text"
                      name="client_phone"
                      value={formData.client_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                      placeholder="📱 +998901234567"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4 mr-2 text-pink-500" />
                      Holati
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-white"
                    >
                      <option value="endi bo`ladigan">⏳ Endi bo'ladigan</option>
                      <option value="bo`lib o`tgan">✅ Bo'lib o'tgan</option>
                    </select>
                  </div>
                </div>

                {/* Submit tugmasi */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white font-semibold bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition-all duration-300 transform hover:scale-105 ${
                      loading ? "opacity-50 cursor-not-allowed scale-100" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Yuklanmoqda...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-3" />💕 Bron qo'shish
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-pink-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 ml-3">Ma'lumot</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bron qo'shgandan so'ng, siz va to'yxona egasi elektron pochta orqali xabar olasiz. Tasdiqlash uchun
                to'yxona egasi siz bilan bog'lanadi.
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl shadow-lg p-5 border border-pink-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 ml-3">Maslahatlar</h3>
              </div>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">💡</span>
                  Oldindan bron qiling - mashhur sanalar tez band bo'ladi
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">📞</span>
                  To'g'ri telefon raqam kiriting - tasdiq uchun zarur
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">👥</span>
                  Mehmonlar sonini aniq hisoblang
                </li>
              </ul>
            </div>

            {/* Features Card */}
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl shadow-lg p-5 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Bizning Xizmatlar
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Bepul maslahat
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  24/7 qo'llab-quvvatlash
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Oson bron qilish
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Ishonchli hamkorlar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBookings

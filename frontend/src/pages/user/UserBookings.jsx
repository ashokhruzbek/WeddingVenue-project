"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Calendar,
  Users,
  Phone,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Star,
  HelpCircle,
  Info,
} from "lucide-react";
import { useLocation } from "react-router-dom"; // Import useLocation

function UserBookings() {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    venue_id: "",
    reservation_date: null,
    guest_count: "",
    client_phone: "",
    status: "endi bo`ladigan",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingVenues, setFetchingVenues] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedVenueDetails, setSelectedVenueDetails] = useState(null);

  const location = useLocation(); // Get location object

  // Token va user_id ni olish
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : { id: null };
  const userId = user.id;

  // To'yxonalarni olish
  useEffect(() => {
    const fetchVenues = async () => {
      setFetchingVenues(true);
      try {
        const response = await axios.get("/api/user/get-venues-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVenues(response.data.venues || response.data);
      } catch (err) {
        console.error("To'yxonalarni yuklashda xatolik:", err);
        setError(
          err.response?.data?.error ||
            "To'yxonalarni yuklashda xatolik yuz berdi"
        );
        setVenues([]);
      } finally {
        setFetchingVenues(false);
      }
    };

    if (token && userId) {
      fetchVenues();
    } else {
      setError("Tizimga kirish uchun token topilmadi");
      setVenues([]);
      setFetchingVenues(false);
    }
  }, [token, userId]);

  // Set venue_id from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const venueIdFromUrl = searchParams.get("venueId");
    if (venueIdFromUrl && venues.length > 0) {
      // Check if the venueIdFromUrl exists in the fetched venues
      const venueExists = venues.some(
        (venue) => venue.id.toString() === venueIdFromUrl
      );
      if (venueExists) {
        setFormData((prev) => ({
          ...prev,
          venue_id: venueIdFromUrl,
        }));
      } else {
        console.warn(
          `Venue with ID ${venueIdFromUrl} not found in the list of venues.`
        );
      }
    }
  }, [location.search, venues]); // Add venues to dependency array

  // Track selected venue details
  useEffect(() => {
    if (formData.venue_id && venues.length > 0) {
      const venue = venues.find((v) => v.id.toString() === formData.venue_id);
      setSelectedVenueDetails(venue);
    } else {
      setSelectedVenueDetails(null);
    }
  }, [formData.venue_id, venues]);

  // Calculate form completion percentage
  const getFormProgress = () => {
    const fields = [
      formData.venue_id,
      formData.reservation_date,
      formData.guest_count,
      formData.client_phone,
      formData.status,
    ];
    const completed = fields.filter((field) => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number formatting
    if (name === "client_phone") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "");
      
      // Format as +998 (XX) XXX-XX-XX
      let formatted = "+998";
      if (digits.length > 3) {
        formatted += ` (${digits.slice(3, 5)}`;
        if (digits.length > 5) {
          formatted += `) ${digits.slice(5, 8)}`;
          if (digits.length > 8) {
            formatted += `-${digits.slice(8, 10)}`;
            if (digits.length > 10) {
              formatted += `-${digits.slice(10, 12)}`;
            }
          }
        }
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      reservation_date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.venue_id) {
      toast.error("Iltimos, to'yxonani tanlang!");
      return;
    }

    if (!formData.reservation_date) {
      toast.error("Iltimos, to'y sanasini tanlang!");
      return;
    }

    if (!formData.guest_count || formData.guest_count < 1) {
      toast.error("Iltimos, mehmonlar sonini kiriting (kamida 1 kishi)!");
      return;
    }

    if (selectedVenueDetails && formData.guest_count > selectedVenueDetails.capacity) {
      toast.error(`Mehmonlar soni to'yxona sig'imidan oshmasligi kerak (maksimal: ${selectedVenueDetails.capacity} kishi)!`);
      return;
    }

    const phoneRegex = /^\+998\s?\(\d{2}\)\s?\d{3}-\d{2}-\d{2}$/;
    const phoneDigits = formData.client_phone.replace(/\D/g, '');
    if (!formData.client_phone || (!phoneRegex.test(formData.client_phone) && phoneDigits.length !== 12)) {
      toast.error("Telefon raqam noto'g'ri formatda! To'g'ri format: +998 (90) 123-45-67");
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmBooking = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError(null);

    try {
      // Clean phone number - send only digits to backend
      const cleanedPhone = formData.client_phone.replace(/\D/g, '');
      
      const response = await axios.post(
        `/api/user/add-booking/${userId}`,
        {
          venue_id: Number(formData.venue_id),
          reservation_date: formData.reservation_date
            .toISOString()
            .split("T")[0],
          guest_count: Number(formData.guest_count),
          client_phone: `+${cleanedPhone}`,
          status: formData.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Bron muvaffaqiyatli qo'shildi!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Formani tozalash
      setFormData({
        venue_id: "",
        reservation_date: null,
        guest_count: "",
        client_phone: "",
        status: "endi bo`ladigan",
      });
    } catch (err) {
      console.error("Bron qo'shishda xatolik:", err.message);
      const errorMessage =
        err.response?.data?.error || "Bron qo'shishda xatolik yuz berdi";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingVenues) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
            <Heart className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
            To'yxonalar yuklanmoqda...
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ToastContainer />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#1E3A5F]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#1E3A5F]/5 rounded-full blur-xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A5F] via-[#2d4a6f] to-[#1E3A5F] py-12">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                  <Calendar className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <Sparkles className="w-6 h-6 text-[#D4AF37] absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight" style={{fontFamily: "'Playfair Display', serif"}}>
              Yangi Bron Qo'shish
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
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
                <p className="text-red-800 font-medium text-sm">
                  Xatolik yuz berdi:
                </p>
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
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] px-6 py-4">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-[#D4AF37] mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-white" style={{fontFamily: "'Playfair Display', serif"}}>
                      Bron Ma'lumotlari
                    </h2>
                    <p className="text-white/80 text-sm">
                      Barcha maydonlarni to'ldiring
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">To'ldirilgan: {getFormProgress()}%</span>
                    <span className="text-xs text-gray-500">{getFormProgress() === 100 ? "✓ Tayyor" : `${5 - Math.floor(getFormProgress() / 20)} maydon qoldi`}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${getFormProgress()}%` }}
                    ></div>
                  </div>
                </div>

                {/* To'yxona tanlash */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" />
                    To'yxonani tanlang
                    <div className="group relative ml-2">
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                        Ro'yxatdan o'zingizga mos to'yxonani tanlang. Sig'im va narx ma'lumotlari ko'rsatilgan.
                      </div>
                    </div>
                  </label>
                  <select
                    name="venue_id"
                    value={formData.venue_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 bg-white"
                    disabled={venues.length === 0}
                  >
                    <option value="">Ro'yxatdan to'yxonani tanlang...</option>
                    {venues.length > 0 ? (
                      venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - {venue.capacity} kishigacha | {Number(venue.price_seat).toLocaleString("uz-UZ")} so'm
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        To'yxonalar mavjud emas
                      </option>
                    )}
                  </select>
                  {selectedVenueDetails && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#D4AF37]" />
                        Maksimal: {selectedVenueDetails.capacity} kishi
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        {selectedVenueDetails.location}
                      </span>
                    </div>
                  )}
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
                      <Calendar className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      To'y sanasini tanlang
                      <div className="group relative ml-2">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                          To'yingiz qachon bo'lishini tanlang. Faqat kelgusi sanalarni tanlash mumkin.
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.reservation_date}
                        onChange={handleDateChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Masalan: 15.06.2026"
                        minDate={new Date()}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Mehmonlar soni
                      <div className="group relative ml-2">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                          To'yingizga qancha mehmon kelishini kiriting. To'yxona sig'imidan oshmasligi kerak.
                        </div>
                      </div>
                    </label>
                    <input
                      type="number"
                      name="guest_count"
                      value={formData.guest_count}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
                      placeholder="Masalan: 250"
                      min="1"
                      max={selectedVenueDetails?.capacity || 1000}
                    />
                    {selectedVenueDetails && (
                      <p className="text-xs text-gray-500 mt-1">
                        <Info className="w-3 h-3 inline mr-1" />
                        Bu to'yxona {selectedVenueDetails.capacity} kishigacha sig'adi
                      </p>
                    )}
                  </div>
                </div>

                {/* Telefon va Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Telefon raqamingiz
                      <div className="group relative ml-2">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                          Aloqa uchun telefon raqamingizni kiriting. Tasdiq uchun ishlatiladi.
                        </div>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="client_phone"
                      value={formData.client_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
                      placeholder="+998 (90) 123-45-67"
                      maxLength={19}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      To'y vaqti
                      <div className="group relative ml-2">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                          To'yingiz kelgusida yoki o'tgan to'yni qayd qilyapsizmi? Ko'pincha "Kelgusi to'y" tanlanadi.
                        </div>
                      </div>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 bg-white"
                    >
                      <option value="endi bo`ladigan">
                        📅 Kelgusi to'y
                      </option>
                      <option value="bo`lib o`tgan">✅ O'tgan to'y</option>
                    </select>
                  </div>
                </div>

                {/* Submit tugmasi */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white font-semibold bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] hover:from-[#c49a2c] hover:to-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-300 transform hover:scale-105 ${
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
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Bron qo'shish
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
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 ml-3" style={{fontFamily: "'Playfair Display', serif"}}>
                  Ma'lumot
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bron qo'shgandan so'ng, siz va to'yxona egasi elektron pochta
                orqali xabar olasiz. Tasdiqlash uchun to'yxona egasi siz bilan
                bog'lanadi.
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#c49a2c]/10 rounded-xl shadow-lg p-5 border border-[#D4AF37]/20">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 ml-3" style={{fontFamily: "'Playfair Display', serif"}}>
                  Maslahatlar
                </h3>
              </div>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                  Oldindan bron qiling - mashhur sanalar tez band bo'ladi
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                  To'g'ri telefon raqam kiriting - tasdiq uchun zarur
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                  Mehmonlar sonini aniq hisoblang
                </li>
              </ul>
            </div>

            {/* Features Card */}
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] rounded-xl shadow-lg p-5 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center" style={{fontFamily: "'Playfair Display', serif"}}>
                <Star className="w-5 h-5 mr-2 text-[#D4AF37]" />
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2" style={{fontFamily: "'Playfair Display', serif"}}>
              Bronni tasdiqlaysizmi?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Iltimos, ma'lumotlaringizni tekshiring
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">To'yxona</p>
                  <p className="font-semibold text-gray-800">{selectedVenueDetails?.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">To'y sanasi</p>
                  <p className="font-semibold text-gray-800">
                    {formData.reservation_date?.toLocaleDateString('uz-UZ', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Mehmonlar</p>
                  <p className="font-semibold text-gray-800">{formData.guest_count} kishi</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Telefon</p>
                  <p className="font-semibold text-gray-800">{formData.client_phone}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] text-white rounded-xl font-semibold hover:from-[#c49a2c] hover:to-[#D4AF37] transition-all shadow-lg"
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBookings;

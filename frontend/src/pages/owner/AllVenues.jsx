"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MapPin,
  Users,
  Phone,
  DollarSign,
  Edit3,
  Trash2,
  Plus,
  Building2,
  AlertCircle,
  Save,
  X,
  Heart,
  Star,
  Sparkles,
  Crown,
  Calendar,
  Eye,
  Settings,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editVenue, setEditVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    district_id: "",
    address: "",
    capacity: "",
    price_seat: "",
    phone_number: "",
  });
  // Rasmlar galereyasi uchun yangi state'lar
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const { id } = JSON.parse(localStorage.getItem("user") || "{}");

    const getData = async () => {
      setLoading(true);
      setError("");

      if (!token || !id) {
        const msg =
          "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan kiring.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`api/owner/view-owner-venue/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API javobi:", response.data);

        if (response.data?.venues && response.data.venues.length > 0) {
          setVenues(response.data.venues);
          setError("");
        } else {
          const noVenuesMsg = "Sizga tegishli to'yxonalar topilmadi";
          setVenues([]);
          setError(noVenuesMsg);
          toast.info(noVenuesMsg);
        }
      } catch (error) {
        console.error("API xatolik:", error.message);

        if (error.response?.status === 401) {
          const authError = "Avtorizatsiya xatoligi. Iltimos, qaytadan kiring.";
          setError(authError);
          toast.error(authError);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else if (error.response?.status === 404) {
          const notFoundMsg = "Sizga tegishli to'yxonalar topilmadi";
          setError(notFoundMsg);
          setVenues([]);
          toast.info(notFoundMsg);
        } else {
          const serverError =
            error.response?.data?.message ||
            "Server bilan bog'lanishda xatolik yuz berdi";
          setError(serverError);
          toast.error(serverError);
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Tahrirlash formasini ochish
  const handleEditClick = (venue) => {
    setEditVenue(venue.id);
    setFormData({
      name: venue.name || "",
      district_id: venue.district_id || "",
      address: venue.address || "",
      capacity: venue.capacity || "",
      price_seat: venue.price_seat || "",
      phone_number: venue.phone_number || venue.phone || "",
    });
  };

  // Forma qiymatini yangilash
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // To'yxonani yangilash
  const handleUpdateVenue = async (venueId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `api/owner/update-owner/${venueId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("💕 To'yxona muvaffaqiyatli yangilandi!");
      setVenues((prevVenues) =>
        prevVenues.map((venue) =>
          venue.id === venueId ? response.data.venue : venue
        )
      );
      setEditVenue(null);
    } catch (error) {
      console.error("Yangilashda xatolik:", error);
      const errorMsg =
        error.response?.data?.message ||
        "To'yxonani yangilashda xatolik yuz berdi";
      toast.error(errorMsg);
    }
  };

  // Tahrirlashni bekor qilish
  const handleCancelEdit = () => {
    setEditVenue(null);
    setFormData({
      name: "",
      district_id: "",
      address: "",
      capacity: "",
      price_seat: "",
      phone_number: "",
    });
  };

  // To'yxonani o'chirish
  const handleDeleteVenue = async (venueId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`api/owner/delete-owner-venue/${venueId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("🗑️ To'yxona muvaffaqiyatli o'chirildi!");
      setVenues((prevVenues) =>
        prevVenues.filter((venue) => venue.id !== venueId)
      );
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      const errorMsg =
        error.response?.data?.message ||
        "To'yxonani o'chirishda xatolik yuz berdi";
      toast.error(errorMsg);
    }
  };

  // Rasmlar galereyasini ochish
  const openGallery = (venue) => {
    setSelectedVenue(venue);
    setCurrentImageIndex(0);
    setIsGalleryOpen(true);
  };

  // Keyingi rasmga o'tish
  const nextImage = () => {
    if (selectedVenue?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedVenue.images.length);
    }
  };

  // Oldingi rasmga qaytish
  const prevImage = () => {
    if (selectedVenue?.images?.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedVenue.images.length) % selectedVenue.images.length
      );
    }
  };

  // Rasmni tanlash
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
            <Building2 className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <Crown className="w-6 h-6 text-white absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              🏰 Mening To'yxonalarim
            </h1>
            <p className="text-lg text-pink-100 max-w-2xl mx-auto">
              Sizning to'yxonalaringizni boshqaring va yangilarini qo'shing
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
              <p className="text-amber-800 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {venues.length > 0 ? (
          <>
            {/* Stats Bar */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border border-pink-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-pink-500" />
                    <span className="text-sm text-gray-600">
                      Jami:{" "}
                      <span className="font-semibold text-gray-800">
                        {venues.length}
                      </span>{" "}
                      ta to'yxona
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">
                      Sizning biznesingiz
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Settings className="h-4 w-4 text-pink-400" />
                  Boshqaruv paneli
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {venues.map((venue, index) => (
                <div
                  key={venue.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-pink-100 hover:border-pink-200"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {editVenue === venue.id ? (
                    // Tahrirlash formasi
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Edit3 className="w-5 h-5 text-pink-500" />
                        <h3 className="text-xl font-bold text-gray-800">
                          To'yxonani tahrirlash
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="🏰 To'yxona nomi"
                          className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                        />
                        <input
                          type="text"
                          name="district_id"
                          value={formData.district_id}
                          onChange={handleInputChange}
                          placeholder="🏘️ Hudud ID"
                          className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                        />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="📍 Manzil"
                          rows={2}
                          className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            placeholder="👥 Sig'im"
                            className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                          />
                          <input
                            type="number"
                            name="price_seat"
                            value={formData.price_seat}
                            onChange={handleInputChange}
                            placeholder="💰 Narx"
                            className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          placeholder="📱 Telefon raqami"
                          className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                          onClick={() => handleUpdateVenue(venue.id)}
                        >
                          <Save className="w-4 h-4" />
                          Saqlash
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4" />
                          Bekor qilish
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Card Header with Creative Gradient */}
                      <div className="h-32 bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="relative h-full flex items-center justify-center">
                          {venue.images &&
                          venue.images.length > 0 &&
                          venue.images[0].image_url ? (
                            <img
                              src={
                                venue.images[0].image_url || "/placeholder.svg"
                              }
                              alt={venue.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="text-center">
                              <Building2 className="w-10 h-10 text-white/90 mx-auto mb-1" />
                              <div className="text-white/80 text-xs font-medium">
                                To'yxona #{index + 1}
                              </div>
                            </div>
                          )}

                          {/* Rasm soni ko'rsatiladi */}
                          {venue.images && venue.images.length > 0 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              <span>{venue.images.length}</span>
                            </div>
                          )}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
                        <Sparkles className="absolute top-3 right-3 w-4 h-4 text-white/60 animate-pulse" />
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300 line-clamp-1">
                            {venue.name || "Nomi ko'rsatilmagan"}
                          </h3>
                          <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            Faol
                          </div>
                        </div>

                        <div className="space-y-3 mb-5">
                          <div className="flex items-start text-gray-600">
                            <MapPin className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm leading-relaxed line-clamp-2">
                              {venue.address || "Manzil ko'rsatilmagan"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 text-rose-500 mr-2" />
                              <span className="text-sm font-medium">
                                {venue.capacity || "N/A"} kishi
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 text-pink-500 mr-2" />
                              <span className="text-xs truncate">
                                {venue.phone_number || venue.phone || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg border border-green-100">
                            <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm font-semibold text-green-600">
                              {venue.price_seat
                                ? `${Number(
                                    venue.price_seat
                                  ).toLocaleString()} so'm`
                                : venue.price
                                ? `${Number(venue.price).toLocaleString()} so'm`
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {venue.description && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-l-4 border-pink-400">
                            <p className="text-xs text-gray-600 leading-relaxed italic">
                              "{venue.description}"
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium py-2.5 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                            onClick={() => handleEditClick(venue)}
                          >
                            <Edit3 className="w-4 h-4" />
                            Tahrirlash
                          </button>
                          <button
                            className="flex-1 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-medium py-2.5 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                            onClick={() => {
                              if (
                                confirm(
                                  `"${venue.name}" to'yxonasini o'chirishni xohlaysizmi?`
                                )
                              ) {
                                handleDeleteVenue(venue.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            O'chirish
                          </button>
                        </div>

                        {/* Additional Actions */}
                        <div className="mt-3 pt-3 border-t border-pink-100 flex gap-2">
                          <button
                            className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-xs font-medium"
                            onClick={() => openGallery(venue)}
                          >
                            <Eye className="w-3 h-3" />
                            Ko'rish
                          </button>
                          <button className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-xs font-medium">
                            <Calendar className="w-3 h-3" />
                            Bronlar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          !error && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-pink-100">
                <div className="mb-8">
                  <div className="relative w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-16 h-16 text-pink-400" />
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    🏰 To'yxonalar topilmadi
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Hozircha sizga tegishli to'yxonalar yo'q. Yangi to'yxona
                    qo'shish uchun tugmani bosing va biznesingizni boshlang!
                  </p>
                </div>

                <button
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                  onClick={() => alert("Yangi to'yxona qo'shish")}
                >
                  <Plus className="w-5 h-5" />
                  💕 To'yxona qo'shish
                </button>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    Oson boshqaruv
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Professional xizmat
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4 text-purple-400" />
                    Premium imkoniyatlar
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Rasmlar galereyasi modali */}
      {isGalleryOpen && selectedVenue && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-pink-50 to-rose-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-pink-500" />
                {selectedVenue.name} - Rasmlar
              </h3>
              <button
                className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setIsGalleryOpen(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Asosiy rasm ko'rsatish qismi */}
            <div className="relative flex-1 min-h-[300px] bg-gray-100 flex items-center justify-center overflow-hidden">
              {selectedVenue.images && selectedVenue.images.length > 0 ? (
                <>
                  <img
                    src={
                      selectedVenue.images[currentImageIndex]?.image_url ||
                      "/placeholder.svg"
                    }
                    alt={`${selectedVenue.name} - Rasm ${
                      currentImageIndex + 1
                    }`}
                    className="max-h-[60vh] max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-200"
                    style={{ display: "none" }}
                  >
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Rasm yuklanmadi</p>
                    </div>
                  </div>

                  {/* Navigatsiya tugmalari */}
                  {selectedVenue.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Rasm raqami */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedVenue.images.length}
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Bu to'yxona uchun rasmlar mavjud emas
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnail rasmlar */}
            {selectedVenue.images && selectedVenue.images.length > 1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {selectedVenue.images.map((image, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-pink-500 shadow-md scale-105"
                          : "border-transparent hover:border-pink-300"
                      }`}
                      onClick={() => selectImage(index)}
                    >
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}

export default AllVenues;

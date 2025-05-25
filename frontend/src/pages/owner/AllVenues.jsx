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
} from "lucide-react";

export function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editVenue, setEditVenue] = useState(null); // Tahrirlash uchun forma holati
  const [formData, setFormData] = useState({
    name: "",
    district_id: "",
    address: "",
    capacity: "",
    price_seat: "",
    phone_number: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const { id } = JSON.parse(localStorage.getItem("user") || "{}");

    const getData = async () => {
      setLoading(true);
      setError("");

      if (!token || !id) {
        const msg = "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan kiring.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/owner/view-owner-venue/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
          // window.location.href = '/login'; // kerak bo'lsa yo'naltirish qo'shilsin
        } else if (error.response?.status === 404) {
          const notFoundMsg = "Sizga tegishli to'yxonalar topilmadi";
          setError(notFoundMsg);
          setVenues([]);
          toast.info(notFoundMsg);
        } else {
          const serverError = error.response?.data?.message || "Server bilan bog'lanishda xatolik yuz berdi";
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
      const response = await axios.put(`http://localhost:4000/owner/update-owner/${venueId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("To'yxona muvaffaqiyatli yangilandi!");
      setVenues((prevVenues) =>
        prevVenues.map((venue) => (venue.id === venueId ? response.data.venue : venue))
      );
      setEditVenue(null); // Formani yopish
    } catch (error) {
      console.error("Yangilashda xatolik:", error);
      const errorMsg = error.response?.data?.message || "To'yxonani yangilashda xatolik yuz berdi";
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
      await axios.delete(`http://localhost:4000/owner/delete-owner-venue/${venueId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("To'yxona muvaffaqiyatli o'chirildi!");
      setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      const errorMsg = error.response?.data?.message || "To'yxonani o'chirishda xatolik yuz berdi";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <Building2 className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">To'yxonalar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Mening To'yxonalarim</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Sizning to'yxonalaringizni boshqaring va yangilarini qo'shing
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-amber-600 mr-3" />
              <p className="text-amber-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {venues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {venues.map((venue, index) => (
              <div
                key={venue.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                {editVenue === venue.id ? (
                  // Tahrirlash formasi
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">To'yxonani tahrirlash</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nomi"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        name="district_id"
                        value={formData.district_id}
                        onChange={handleInputChange}
                        placeholder="Hudud ID"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Manzil"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="Sig'im (kishi)"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        name="price_seat"
                        value={formData.price_seat}
                        onChange={handleInputChange}
                        placeholder="Narx (so'm)"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Telefon raqami"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                        onClick={() => handleUpdateVenue(venue.id)}
                      >
                        Saqlash
                      </button>
                      <button
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                        onClick={handleCancelEdit}
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Card Header with Gradient */}
                    <div className="h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <div className="relative h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-white/80" />
                      </div>

                      {/* Decorative circles */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                        {venue.name || "Nomi ko'rsatilmagan"}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{venue.address || "Manzil ko'rsatilmagan"}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-sm font-medium">{venue.capacity || "N/A"} kishi</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-sm font-semibold text-green-600">
                            {venue.price_seat
                              ? `${Number(venue.price_seat).toLocaleString()} so'm`
                              : venue.price
                                ? `${Number(venue.price).toLocaleString()} so'm`
                                : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Phone className="w-5 h-5 text-indigo-500 mr-3" />
                          <span className="text-sm">{venue.phone_number || venue.phone || "N/A"}</span>
                        </div>
                      </div>

                      {venue.description && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm text-gray-600 leading-relaxed italic">"{venue.description}"</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          onClick={() => handleEditClick(venue)}
                        >
                          <Edit3 className="w-4 h-4" />
                          Tahrirlash
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          onClick={() => alert(`O'chirish: ${venue.name}`) || handleDeleteVenue(venue.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          O'chirish
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-12 h-12 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">To'yxonalar topilmadi</h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Hozircha sizga tegishli to'yxonalar yo'q. Yangi to'yxona qo'shish uchun tugmani bosing.
                  </p>
                </div>

                <button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                  onClick={() => alert("Yangi to'yxona qo'shish")}
                >
                  <Plus className="w-5 h-5" />
                  To'yxona qo'shish
                </button>
              </div>
            </div>
          )
        )}
      </div>

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
      `}</style>
    </div>
  );
}

export default AllVenues;
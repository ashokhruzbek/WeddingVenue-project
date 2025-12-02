"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar,
  Star,
  Camera,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#1E3A5F] rounded-full p-2.5 shadow-lg transition-all duration-200 hover:scale-110"
    aria-label="Oldingi rasm"
  >
    <ChevronLeft size={20} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#1E3A5F] rounded-full p-2.5 shadow-lg transition-all duration-200 hover:scale-110"
    aria-label="Keyingi rasm"
  >
    <ChevronRight size={20} />
  </button>
);

// Toshkent shahri tumanlari ro'yxati
const tashkentDistricts = [
  { id: 1, name: "Bektemir" },
  { id: 2, name: "Mirzo Ulug'bek" },
  { id: 3, name: "Mirobod" },
  { id: 4, name: "Olmazor" },
  { id: 5, name: "Sirg'ali" },
  { id: 6, name: "Uchtepa" },
  { id: 7, name: "Chilonzor" },
  { id: 8, name: "Shayxontohur" },
  { id: 9, name: "Yunusobod" },
  { id: 10, name: "Yakkasaroy" },
  { id: 11, name: "Yashnobod" },
  { id: 12, name: "Yangihayot" },
];

function Home() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(9);

  const handleClickCheck = () => {
    if (!token) {
      toast.error("Iltimos, avval tizimga kiring!", {
        duration: 3000,
        position: "top-right",
      });
      navigate("/login");
    }
  };

  // Fix image URL helper
  const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://localhost:4000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("/api/venues");
        // Backend { venues: [...] } formatida qaytaradi
        const venuesData = response.data.venues || response.data;
        // Status "tasdiqlangan" yoki "approved" bo'lishi mumkin
        const approvedVenues = venuesData.filter(
          (venue) => venue.status === "approved" || venue.status === "tasdiqlangan"
        );
        setVenues(approvedVenues);
        setFilteredVenues(approvedVenues);
      } catch (error) {
        console.error("Xatolik:", error);
        toast.error("To'yxonalarni yuklashda xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();

    // Load favorites
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    let result = venues;
    if (search) {
      result = result.filter((venue) =>
        venue.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (districtFilter !== "all") {
      result = result.filter(
        (venue) => venue.district_id === parseInt(districtFilter)
      );
    }
    setFilteredVenues(result);
    setCurrentPage(1);
  }, [search, districtFilter, venues]);

  const toggleFavorite = (e, venueId) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(venueId)
      ? favorites.filter((id) => id !== venueId)
      : [...favorites, venueId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };

  const getRandomRating = () => (4 + Math.random()).toFixed(1);

  // Pagination
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative bg-[#1E3A5F] py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Premium <span className="text-[#D4AF37]">To'yxonalar</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              O'zbekistonning eng sara to'yxonalarini kashf eting va o'z to'yingizni unutilmas qiling
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="To'yxona nomini qidiring..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 outline-none text-gray-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="relative md:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 outline-none appearance-none bg-white text-gray-700"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                >
                  <option value="all">Barcha tumanlar</option>
                  {tashkentDistricts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c49a2c] text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25">
                <Search size={20} />
                Qidirish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mavjud To'yxonalar
            </h2>
            <p className="text-gray-500 mt-1">
              <span className="text-[#D4AF37] font-semibold">{filteredVenues.length}</span> ta natija topildi
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#2d4a6f] transition-colors">
              Eng mashhur
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors">
              Eng arzon
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors">
              Eng qimmat
            </button>
          </div>
        </div>

        {/* Venues Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.length === 0 ? (
              <div className="col-span-full py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Hech narsa topilmadi</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Boshqa kalit so'zlar bilan qidirib ko'ring yoki filtrlarni o'zgartiring
                </p>
              </div>
            ) : (
              currentVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  onClick={() => handleCardClick(venue)}
                >
                  {/* Image */}
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    {venue.images && venue.images.length > 0 ? (
                      <img
                        src={fixImageUrl(venue.images[0].image_url)}
                        alt={venue.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-gray-300" />
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      onClick={(e) => toggleFavorite(e, venue.id)}
                    >
                      <Heart
                        size={18}
                        className={favorites.includes(venue.id) ? "fill-rose-500 text-rose-500" : "text-gray-500"}
                      />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                      <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="font-semibold text-[#1E3A5F] text-sm">{getRandomRating()}</span>
                    </div>

                    {/* Images Count */}
                    {venue.images && venue.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                        <Camera size={14} className="text-[#1E3A5F]" />
                        <span className="font-semibold text-[#1E3A5F] text-sm">{venue.images.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-[#1E3A5F] truncate pr-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {venue.name}
                      </h3>
                      <span className="px-2.5 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold rounded-full whitespace-nowrap">
                        Premium
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-[#D4AF37] shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-[#D4AF37]" />
                          <span><strong>{venue.capacity}</strong> kishi</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} className="text-[#D4AF37]" />
                          <span>24/7</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign size={16} className="text-emerald-500" />
                        <span className="font-bold text-emerald-600">{Number(venue.price_seat).toLocaleString()} so'm</span>
                        <span className="text-gray-400">/ kishi</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-[#D4AF37]" />
                        <span>{venue.phone_number}</span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 bg-[#1E3A5F] hover:bg-[#2d4a6f] text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(venue);
                      }}
                    >
                      Batafsil ko'rish
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Oldingi</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/25"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="hidden sm:inline">Keyingi</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && selectedVenue && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-[#1E3A5F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedVenue.name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {selectedVenue.address}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-grow p-5">
              {/* Images Slider */}
              {selectedVenue.images && selectedVenue.images.length > 0 ? (
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <Slider {...sliderSettings}>
                    {selectedVenue.images.map((image, index) => (
                      <div key={index} className="h-[300px] md:h-[400px] bg-gray-100">
                        <img
                          src={fixImageUrl(image.image_url)}
                          alt={`${selectedVenue.name} - rasm ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="h-[300px] bg-gray-100 flex items-center justify-center rounded-xl mb-6">
                  <Building2 className="w-20 h-20 text-gray-300" />
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Manzil</p>
                      <p className="text-gray-600">{selectedVenue.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Users className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Sig'imi</p>
                      <p className="text-gray-600">{selectedVenue.capacity} kishi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                    <DollarSign className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Narxi</p>
                      <p className="text-emerald-600 font-bold">{Number(selectedVenue.price_seat).toLocaleString()} so'm / kishi</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Telefon</p>
                      <p className="text-gray-600">{selectedVenue.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Tuman</p>
                      <p className="text-gray-600">
                        {tashkentDistricts.find((d) => d.id === Number(selectedVenue.district_id))?.name || "Noma'lum"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Clock className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Ish vaqti</p>
                      <p className="text-gray-600">24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  handleClickCheck();
                  closeModal();
                }}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49a2c] text-white font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25"
              >
                <Calendar size={18} />
                Band qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

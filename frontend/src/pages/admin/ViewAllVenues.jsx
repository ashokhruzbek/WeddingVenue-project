import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Building,
  Phone,
  Users,
  DollarSign,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  X,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const fixImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  let correctedUrl = url;

  // 1. Replace backslashes with forward slashes
  correctedUrl = correctedUrl.replace(new RegExp("\\\\\\\\", "g"), "/");

  // 2. Normalize case for "Uploads/" and "Venues/" path segments
  correctedUrl = correctedUrl.replace(
    new RegExp("/Uploads/", "gi"),
    "/uploads/"
  );
  correctedUrl = correctedUrl.replace(new RegExp("/Venues/", "gi"), "/venues/");

  // 3. Specific fix for duplicated path segments like "/uploads/venues/uploads/" or "/uploads/venues/uploads/venues/"
  correctedUrl = correctedUrl.replace(
    new RegExp("(/uploads/)(?:uploads/|uploads/)", "gi"),
    "$1"
  );

  // 4. General fix for any consecutive duplicate "/uploads/" like "/uploads/uploads/"
  correctedUrl = correctedUrl.replace(
    new RegExp("(/uploads/)uploads/", "gi"),
    "$1"
  );

  // 5. Remove multiple consecutive slashes (e.g., // or ///), but not after http: or https:
  correctedUrl = correctedUrl.replace(new RegExp("(?<!:)//+", "g"), "/");

  // 6. Ensure it starts with the base URL if it's a relative path
  const baseUrl = "http://13.51.241.247/api";
  if (correctedUrl.startsWith("/uploads")) {
    // Path like "/uploads/image.png" or "/uploads/venues/image.png"
    correctedUrl = baseUrl + correctedUrl;
  } else if (
    !correctedUrl.startsWith("http://") &&
    !correctedUrl.startsWith("https://")
  ) {
    // This block handles relative paths that don't start with "/uploads" or "http(s)://"
    // (e.g., "image.png", "venues/image.png", "/venues/image.png")
    let cleanedPath = correctedUrl.replace(new RegExp("^/+"), ""); // remove leading slashes from original relative path

    // Check if the original URL string (before any modification in this function) indicated a venue-specific path
    // This is a heuristic. If backend sometimes returns "venues/img.jpg" and sometimes "img.jpg" for the same subfolder,
    // this logic might need more context or a more reliable indicator from the API data itself.
    if (url.toLowerCase().includes("venues/")) {
      // Original URL suggested it belongs in /uploads/venues/
      // Remove any leading "uploads/" or "venues/" from cleanedPath before prepending full prefix
      let imageName = cleanedPath.replace(
        new RegExp("^(uploads/|venues/)+", "i"),
        ""
      );
      correctedUrl = baseUrl + "/uploads/" + imageName;
    } else {
      // Original URL did NOT explicitly suggest "venues/". Assume it belongs in /uploads/
      // Remove any leading "uploads/" from cleanedPath
      let imageName = cleanedPath.replace(new RegExp("^(uploads/)+", "i"), "");
      correctedUrl = baseUrl + "/uploads/" + imageName;
    }
  }

  // 7. Final cleanup for double slashes immediately after base URL (e.g., http://13.51.241.247/api//uploads)
  if (correctedUrl.startsWith(baseUrl + "//")) {
    correctedUrl = baseUrl + correctedUrl.substring(baseUrl.length + 1);
  }

  // 8. Clean up general double slashes after the protocol part, e.g. http://domain//path -> http://domain/path
  correctedUrl = correctedUrl.replace(
    new RegExp("(https?://)([^/]+)(//+)", "g"),
    "$1$2/"
  );

  // 9. Remove trailing slash if it's not the base URL itself (and if the URL is not just the base URL)
  if (
    correctedUrl !== baseUrl &&
    correctedUrl !== baseUrl + "/" &&
    correctedUrl.endsWith("/")
  ) {
    correctedUrl = correctedUrl.slice(0, -1);
  }
  return correctedUrl;
};

const VenuesList = () => {
  const [venues, setVenues] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    capacity: "",
    price_seat: "",
    district_id: "",
    address: "",
  });
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  // Fetch districts for dropdown
  const fetchDistricts = useCallback(() => {
    const tashkentDistricts = [
      { id: 1, name: "Bektemir" },
      { id: 2, name: "Chilonzor" },
      { id: 3, name: "Yashnobod" },
      { id: 4, name: "Mirobod" },
      { id: 5, name: "Mirzo Ulug'bek" }, // Corrected escape
      { id: 6, name: "Sergeli" },
      { id: 7, name: "Shayxontohur" },
      { id: 8, name: "Olmazor" },
      { id: 9, name: "Uchtepa" },
      { id: 10, name: "Yakkasaroy" },
      { id: 11, name: "Yunusobod" },
    ];
    setDistricts(tashkentDistricts);
  }, []);

  const fetchImageAsBlob = async (imageUrl) => {
    if (!imageUrl) return null;
    setImageLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching image:", imageUrl, error);
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      const params = { page: currentPage, limit: 10 };
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.order = sortOrder;

      const response = await axios.get(
        "http://13.51.241.247/api/admin/view-all-venues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      if (!response.data.venues) {
        throw new Error("To'yxonalar ma'lumotlari topilmadi"); // Corrected escape
      }

      const updatedVenues = await Promise.all(
        response.data.venues.map(async (venue) => {
          if (venue.images && venue.images.length > 0) {
            const updatedImages = await Promise.all(
              venue.images.map(async (image) => {
                const correctedImageUrl = fixImageUrl(image.image_url);
                const blobUrl = await fetchImageAsBlob(correctedImageUrl);
                return {
                  ...image,
                  blob_url: blobUrl,
                  corrected_raw_url: correctedImageUrl,
                };
              })
            );
            return { ...venue, images: updatedImages };
          }
          return venue;
        })
      );

      setVenues(updatedVenues);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Ma'lumotlarni olishda xatolik" // Corrected escape
      );
      toast.error(
        error.response?.data?.error || "To'yxonalarni olishda xatolik yuz berdi" // Corrected escape
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchTerm, sortBy, sortOrder, currentPage, navigate]);

  useEffect(() => {
    fetchVenues();
    fetchDistricts();
  }, [fetchVenues, fetchDistricts]);

  const handleDelete = async (venueId) => {
    if (!window.confirm("Bu to'yxonani o'chirishni tasdiqlaysizmi?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      await axios.delete(
        `http://13.51.241.247/api/admin/delete-venue/${venueId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("To'yxona muvaffaqiyatli o'chirildi", { duration: 3000 });
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "To'yxonani o'chirishda xatolik yuz berdi";
      toast.error(errorMessage, { duration: 3000 });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const openUpdateModal = (venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name || "",
      phone_number: venue.phone_number || "",
      capacity: venue.capacity || "",
      price_seat: venue.price_seat || "",
      district_id: venue.district_id || "",
      address: venue.address || "",
    });
    setFormError(null);
    setIsUpdateModalOpen(true);
  };

  const openImageModal = async (venue) => {
    setSelectedVenue(venue);
    if (venue.images && venue.images.length > 0) {
      const firstImage = venue.images[0];
      setSelectedImage(
        firstImage.blob_url || firstImage.corrected_raw_url || null
      );
    } else {
      setSelectedImage(null);
    }
    setIsImageModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedVenue) return;

    if (!formData.address || formData.address.trim() === "") {
      setFormError("Manzil kiritilishi shart.");
      toast.error("Manzil kiritilishi shart.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      const updatedData = {
        name: formData.name,
        phone_number: formData.phone_number,
        capacity: Number(formData.capacity),
        price_seat: Number(formData.price_seat),
        district_id: formData.district_id ? Number(formData.district_id) : null,
        address: formData.address,
      };

      const response = await axios.put(
        `http://13.51.241.247/api/admin/update-venue/${selectedVenue.id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        response.data.message || "To'yxona muvaffaqiyatli yangilandi",
        { duration: 3000 }
      );
      setIsUpdateModalOpen(false);
      setSelectedVenue(null);
      fetchVenues();
    } catch (error) {
      console.error("Error updating venue:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "To'yxonani yangilashda xatolik yuz berdi";
      setFormError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "tasdiqlangan":
        return "bg-green-100 text-green-800 border-green-300";
      case "kutilmoqda":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rad etilgan":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const clearFilters = () => {
    setFilterStatus("");
    setSearchTerm("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
    toast.success("Filtrlar tozalandi");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-6">
      <style jsx>{`
        .thumbnail-gallery {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 8px 0;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
        }
        .thumbnail-gallery::-webkit-scrollbar {
          height: 6px;
        }
        .thumbnail-gallery::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .thumbnail-gallery::-webkit-scrollbar-track {
          background: transparent;
        }
        .thumbnail {
          flex: 0 0 auto;
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }
        .thumbnail:hover {
          transform: scale(1.05);
          border-color: #ec4899;
        }
        .thumbnail.active {
          border-color: #ec4899;
          box-shadow: 0 0 8px rgba(236, 72, 153, 0.5);
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <Building className="h-6 w-6 text-pink-500" />
        <h1 className="text-2xl font-bold text-gray-800">Barcha to'yxonalar</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-50 rounded-xl shadow-lg p-4 mb-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Nom bo'yicha qidirish"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
              disabled={loading}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              disabled={loading}
            >
              <option value="">Barchasi</option>
              <option value="tasdiqlangan">Tasdiqlangan</option>
              <option value="kutilmoqda">Kutilmoqda</option>
              <option value="tasdiqlanmagan">Tasdiqlanmagan</option>
              <option value="rad etilgan">Rad etilgan</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              disabled={loading}
            >
              <option value="">Standart</option>
              <option value="price_seat">Narx bo'yicha</option>
              <option value="capacity">Sig'im bo'yicha</option>
            </select>
            {sortOrder === "asc" ? (
              <SortAsc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            ) : (
              <SortDesc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            )}
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white text-gray-800"
              disabled={loading || !sortBy}
            >
              <option value="asc">O'sish</option>
              <option value="desc">Kamayish</option>
            </select>
            {sortOrder === "asc" ? (
              <SortAsc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            ) : (
              <SortDesc className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            )}
          </div>

          <button
            onClick={clearFilters}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            Tozalash
          </button>
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
            <div
              className="absolute top-0 left-0 h-24 w-full rounded-full border-t-4 border-b-4 border-pink-300 animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
        </div>
      ) : venues.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-20 text-gray-500"
        >
          To'yxonalar topilmadi
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {venues.map((venue, index) => (
              <motion.div
                key={venue.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer"
                onClick={() => openImageModal(venue)}
              >
                {imageLoading ? (
                  <div className="flex items-center justify-center h-56 bg-gray-100">
                    <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
                  </div>
                ) : venue.images && venue.images.length > 0 ? (
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={
                        venue.images[0].blob_url ||
                        venue.images[0].corrected_raw_url ||
                        ""
                      }
                      alt={venue.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        const imgElement = e.target;
                        const currentVenueImage = venue.images[0];
                        // If src is already corrected_raw_url or if corrected_raw_url is missing, show placeholder
                        if (
                          imgElement.src ===
                            currentVenueImage.corrected_raw_url ||
                          !currentVenueImage.corrected_raw_url
                        ) {
                          imgElement.style.display = "none";
                          const placeholder = imgElement.nextElementSibling;
                          if (
                            placeholder &&
                            placeholder.classList.contains(
                              "placeholder-icon-container"
                            )
                          ) {
                            placeholder.style.display = "flex";
                          }
                        } else {
                          // blob_url failed (or was initially empty), try corrected_raw_url
                          imgElement.onerror = null; // Prevent infinite loop
                          imgElement.src = currentVenueImage.corrected_raw_url;
                          // If corrected_raw_url also fails, the first condition of this onError will handle it next time.
                        }
                      }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gray-200 placeholder-icon-container"
                      style={{ display: "none" }}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>{venue.images.length}</span>
                      <ImageIcon className="h-3 w-3" />
                    </div>
                  </div>
                ) : (
                  <div className="h-56 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {index + 1}. {venue.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        venue.status
                      )}`}
                    >
                      {venue.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-pink-500" />
                      <span>{venue.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-pink-500" />
                      <span>O'rindandlar: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-pink-500" />
                      <span>
                        Narxi:{" "}
                        {Number(venue.price_seat).toLocaleString("uz-UZ")} so'm
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openUpdateModal(venue);
                      }}
                      className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <Edit className="h-4 w-4" />
                      Tahrirlash
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(venue.id);
                      }}
                      className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      O'chirish
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center items-center mt-8">
            <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-pink-500 hover:bg-pink-100"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-gray-800 px-4 py-2">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-pink-500 hover:bg-pink-100"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Update Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  To'yxonani tahrirlash
                </h2>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded-lg mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To'yxona nomi
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon raqami
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    O'rindandlar soni
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Narxi (so'm)
                  </label>
                  <input
                    type="number"
                    name="price_seat"
                    value={formData.price_seat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuman
                  </label>
                  <select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Tumanni tanlang</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manzil
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-300"
                  >
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors duration-300"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {isImageModalOpen && selectedVenue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 text-gray-800 hover:bg-gray-200 p-2 rounded-full z-20"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {selectedVenue.name} - Rasmlar
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Main Image */}
                  <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
                    {imageLoading ? (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200">
                        <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
                      </div>
                    ) : selectedImage ? (
                      <>
                        <motion.img
                          src={selectedImage} // This is initially blob_url or corrected_raw_url
                          alt="Selected venue image"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          onError={(e) => {
                            const imgElement = e.target;
                            const currentImageObject =
                              selectedVenue.images.find(
                                (img) =>
                                  img.blob_url === selectedImage ||
                                  img.corrected_raw_url === selectedImage
                              );

                            if (
                              currentImageObject &&
                              currentImageObject.corrected_raw_url &&
                              imgElement.src !==
                                currentImageObject.corrected_raw_url
                            ) {
                              // If current src (selectedImage which might be blob) failed, and it's not already the corrected_raw_url, try corrected_raw_url
                              imgElement.onerror = null;
                              imgElement.src =
                                currentImageObject.corrected_raw_url;
                            } else {
                              // All attempts failed or no corrected_raw_url, show placeholder
                              imgElement.style.display = "none";
                              const placeholder = imgElement.nextElementSibling;
                              if (
                                placeholder &&
                                placeholder.classList.contains(
                                  "placeholder-icon-container-modal"
                                )
                              ) {
                                placeholder.style.display = "flex";
                              }
                            }
                          }}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-gray-200 placeholder-icon-container-modal"
                          style={{ display: "none" }}
                        >
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    {selectedVenue.images &&
                      selectedVenue.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          {selectedVenue.images.findIndex(
                            (img) =>
                              img.blob_url === selectedImage ||
                              img.corrected_raw_url === selectedImage
                          ) + 1}{" "}
                          / {selectedVenue.images.length}
                        </div>
                      )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {selectedVenue.images && selectedVenue.images.length > 0 && (
                    <div className="thumbnail-gallery">
                      {selectedVenue.images.map((image, idx) => (
                        <motion.img
                          key={idx}
                          src={image.blob_url || image.image_url}
                          alt={`${selectedVenue.name} thumbnail ${idx + 1}`}
                          className={`thumbnail ${
                            selectedImage ===
                            (image.blob_url || image.image_url)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedImage(image.blob_url || image.image_url)
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VenuesList;

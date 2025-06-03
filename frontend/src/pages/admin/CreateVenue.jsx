import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Building,
  Phone,
  Users,
  DollarSign,
  MapPin,
  Upload,
  X,
  Trash2,
  Save,
  Maximize2,
} from "lucide-react";

// Toshkent shahridagi tumanlar ro‘yxati
const tashkentDistricts = [
  { id: "1", name: "Bektemir" },
  { id: "2", name: "Chilanzar" },
  { id: "3", name: "Mirzo Ulug‘bek" },
  { id: "4", name: "Olmazor" },
  { id: "5", name: "Sergeli" },
  { id: "6", name: "Shayxontohur" },
  { id: "7", name: "Uchtepa" },
  { id: "8", name: "Yashnobod" },
  { id: "9", name: "Yakkasaroy" },
  { id: "10", name: "Yangihayot" },
  { id: "11", name: "Mirobod" },
  { id: "12", name: "Yunusobod" },
];

const CreateVenue = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    capacity: "",
    price_seat: "",
    district_id: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image upload
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  // Image change with toast notification
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 5; // Maximum number of images

    // Image validation
    const invalidFiles = files.filter(
      (file) => !validImageTypes.includes(file.type) || file.size > maxFileSize
    );
    if (invalidFiles.length > 0) {
      toast.error(
        "Faqat JPG, PNG yoki GIF formatidagi rasmlar, 5MB dan kichik bo‘lishi kerak"
      );
      setError(
        "Faqat JPG, PNG yoki GIF formatidagi rasmlar, 5MB dan kichik bo‘lishi kerak"
      );
      return;
    }

    if (images.length + files.length > maxImages) {
      setError(`Maksimal ${maxImages} ta rasm yuklash mumkin`);
      toast.error(`Maksimal ${maxImages} ta rasm yuklash mumkin`);
      return;
    }

    setError(null);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    toast.success(`${files.length} ta rasm muvaffaqiyatli yuklandi!`);
  };

  // Remove image with toast notification
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Rasm o‘chirildi!");
  };

  // Phone number validation
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+998\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Open image preview
  const openImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  // Close image preview
  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  // Form submission with toast notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.name) {
      setError("To‘yxona nomini kiriting");
      toast.error("To‘yxona nomini kiriting");
      setLoading(false);
      return;
    }
    if (!validatePhoneNumber(formData.phone_number)) {
      setError(
        "Telefon raqami +998 bilan boshlanib, 12 raqamdan iborat bo‘lishi kerak (masalan, +998901234567)"
      );
      toast.error(
        "Telefon raqami +998 bilan boshlanib, 12 raqamdan iborat bo‘lishi kerak (masalan, +998901234567)"
      );
      setLoading(false);
      return;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError("O‘rindiqlar soni ijobiy bo‘lishi kerak");
      toast.error("O‘rindiqlar soni ijobiy bo‘lishi kerak");
      setLoading(false);
      return;
    }
    if (!formData.price_seat || formData.price_seat <= 0) {
      setError("Narx ijobiy bo‘lishi kerak");
      toast.error("Narx ijobiy bo‘lishi kerak");
      setLoading(false);
      return;
    }
    if (!formData.district_id) {
      setError("Tuman tanlang");
      toast.error("Tuman tanlang");
      setLoading(false);
      return;
    }
    if (!formData.address) {
      setError("Manzil kiriting");
      toast.error("Manzil kiriting");
      setLoading(false);
      return;
    }
    if (images.length === 0) {
      setError("Kamida bitta rasm yuklang");
      toast.error("Kamida bitta rasm yuklang");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Autentifikatsiya tokeni topilmadi");
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("capacity", Number(formData.capacity));
      formDataToSend.append("price_seat", Number(formData.price_seat));
      formDataToSend.append("district_id", formData.district_id);
      formDataToSend.append("address", formData.address);
      images.forEach((image) => {
        formDataToSend.append("images", image.file);
      });

      const response = await axios.post(
        "http://13.51.241.247/api/admin/create-venue",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({
        name: "",
        phone_number: "",
        capacity: "",
        price_seat: "",
        district_id: "",
        address: "",
      });
      setImages([]);
      toast.success("To‘yxona muvaffaqiyatli yaratildi");

      navigate("/admin/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
      const errorMessage =
        error.response?.data?.error || "To‘yxona yaratishda xatolik yuz berdi";
      setError(errorMessage);
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-4"
      >
        <Building className="h-6 w-6 text-[#ff4d94]" />
        <h1 className="text-2xl font-bold text-[#333333]">
          Yangi to‘yxona yaratish
        </h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#fee2e2] border border-[#ff4d94] text-[#dc2626] px-3 py-2 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-[#ffffff] rounded-xl shadow-lg p-4 space-y-4 max-h-[80vh] overflow-y-auto"
      >
        {/* Venue Name */}
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#333333]"
          >
            To‘yxona nomi
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-2 h-4 w-4 text-[#ff4d94]" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-[#ff4d94] rounded-md focus:ring-2 focus:ring-[#ff4d94] focus:border-[#ff4d94] bg-[#ffffff] text-[#333333] text-sm"
              disabled={loading}
              placeholder="To‘yxona nomini kiriting"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-[#333333]"
          >
            Telefon raqami
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2 h-4 w-4 text-[#ff4d94]" />
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-[#ff4d94] rounded-md focus:ring-2 focus:ring-[#ff4d94] focus:border-[#ff4d94] bg-[#ffffff] text-[#333333] text-sm"
              disabled={loading}
              placeholder="+998901234567"
            />
          </div>
          <p className="text-xs text-[#666666]">Masalan, +998901234567</p>
        </div>

        {/* Capacity and Price - Two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1">
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-[#333333]"
            >
              O‘rindiqlar soni
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-2 h-4 w-4 text-[#ff4d94]" />
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-1.5 border border-[#ff4d94] rounded-md focus:ring-2 focus:ring-[#ff4d94] focus:border-[#ff4d94] bg-[#ffffff] text-[#333333] text-sm"
                disabled={loading}
                min="1"
                placeholder="O‘rindiqlar soni"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="price_seat"
              className="block text-sm font-medium text-[#333333]"
            >
              Narxi (so‘m)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2 h-4 w-4 text-[#ff4d94]" />
              <input
                type="number"
                id="price_seat"
                name="price_seat"
                value={formData.price_seat}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-1.5 border border-[#ff4d94] rounded-md focus:ring-2 focus:ring-[#ff4d94] focus:border-[#ff4d94] bg-[#ffffff] text-[#333333] text-sm"
                disabled={loading}
                min="1"
                placeholder="Narxi"
              />
            </div>
          </div>
        </div>

        {/* District */}
        <div className="space-y-1">
          <label
            htmlFor="district_id"
            className="block text-sm font-medium text-[#333333]"
          >
            Tuman
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2 h-4 w-4 text-[#ff4d94]" />
            <select
              id="district_id"
              name="district_id"
              value={formData.district_id}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-[#ff4d94] rounded-md focus:ring-2 focus:ring-[#ff4d94] focus:border-[#ff4d94] appearance-none bg-[#ffffff] text-[#333333] text-sm"
              disabled={loading}
            >
              <option value="">Tuman tanlang</option>
              {tashkentDistricts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-[#333333]"
          >
            Manzil
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2 h-4 w-4 text-[#ff4d94]" />
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-8 pr-3 py-1.5 border border-[#ff4d94] rounded-md focus:ring-2 focus:ring-[#ff4d94] focus:border-[#ff4d94] bg-[#ffffff] text-[#333333] text-sm"
              disabled={loading}
              rows={1}
              placeholder="To‘yxona manzilini kiriting"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-[#333333]">
              Rasmlar
            </label>
            <span className="text-xs text-[#666666]">
              {images.length}/5 rasm
            </span>
          </div>

          <div
            onClick={handleImageUpload}
            className={`border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              loading
                ? "border-[#ff4d94]/30 bg-[#f9f9f9]"
                : "border-[#ff4d94] bg-[#f9f9f9] hover:border-[#ff1a75] hover:bg-[#f1f1f1]"
            }`}
          >
            <Upload className="h-8 w-8 text-[#ff4d94] mb-1" />
            <p className="text-sm text-[#333333]">Rasmlarni yuklash</p>
            <p className="text-xs text-[#666666] mt-0.5">
              JPG, PNG yoki GIF, maksimal 5MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/jpeg,image/png,image/gif"
              multiple
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#333333]">
              Yuklangan rasmlar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <div className="relative h-16 rounded-md overflow-hidden border border-[#ff4d94]">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openImagePreview(image.preview)}
                          className="p-1 bg-[#ff4d94]/80 rounded-full text-white mr-1"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 bg-[#dc2626]/80 rounded-full text-white"
                          disabled={loading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-[#ff4d94] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center border border-[#ffffff]">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 bg-[#ff4d94] hover:bg-[#ff1a75] text-white rounded-md flex items-center justify-center transition-colors text-sm"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                Yaratilmoqda...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Yaratish
              </>
            )}
          </button>
        </div>
      </motion.form>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-3xl max-h-[80vh] w-full">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-[#ff4d94] transition-colors"
            >
              <X className="h-7 w-7" />
            </button>
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVenue;

"use client"

import { useState, useRef } from "react"
import {
  Building2,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Maximize2,
  X,
  Info,
} from "lucide-react"

// Toshkent tumanlari ro'yxati
const tashkentDistricts = [
  { id: 1, name: "Bektemir tumani" },
  { id: 2, name: "Chilonzor tumani" },
  { id: 3, name: "Mirobod tumani" },
  { id: 4, name: "Mirzo Ulugbek tumani" },
  { id: 5, name: "Olmazar tumani" },
  { id: 6, name: "Sergeli tumani" },
  { id: 7, name: "Shayxontohur tumani" },
  { id: 8, name: "Uchtepa tumani" },
  { id: 9, name: "Yakkasaray tumani" },
  { id: 10, name: "Yashnobod tumani" },
  { id: 11, name: "Yunusobod tumani" },
]

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-sm`}
    >
      {type === "success" && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
      {type === "error" && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1 flex-shrink-0">
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

function AddVenues() {
  const [formData, setFormData] = useState({
    name: "",
    district_id: "",
    address: "",
    capacity: "",
    price_seat: "",
    phone_number: "",
  })
  const [images, setImages] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [toasts, setToasts] = useState([])
  const fileInputRef = useRef(null)

  // Toast functions
  const showToast = (message, type = "info") => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Input o'zgarishini ushlash
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Rasm yuklashni boshlash
  const handleImageUpload = () => {
    fileInputRef.current.click()
  }

  // Rasm tanlash va validatsiya
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"]
    const maxFileSize = 5 * 1024 * 1024 // 5MB
    const maxImages = 5

    const invalidFiles = files.filter((file) => !validImageTypes.includes(file.type) || file.size > maxFileSize)

    if (invalidFiles.length > 0) {
      showToast("Faqat JPG, PNG yoki GIF formatidagi rasmlar, 5MB dan kichik bo'lishi kerak", "error")
      setErrors((prev) => ({
        ...prev,
        images: "Faqat JPG, PNG yoki GIF formatidagi rasmlar, 5MB dan kichik bo'lishi kerak",
      }))
      return
    }

    if (images.length + files.length > maxImages) {
      setErrors((prev) => ({
        ...prev,
        images: `Maksimal ${maxImages} ta rasm yuklash mumkin`,
      }))
      showToast(`Maksimal ${maxImages} ta rasm yuklash mumkin`, "error")
      return
    }

    setErrors((prev) => ({ ...prev, images: "" }))
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages])
    showToast(`${files.length} ta rasm muvaffaqiyatli yuklandi!`, "success")
  }

  // Rasmni o'chirish
  const handleRemoveImage = (index) => {
    const imageToRemove = images[index]
    URL.revokeObjectURL(imageToRemove.preview)
    setImages((prev) => prev.filter((_, i) => i !== index))
    showToast("Rasm o'chirildi!", "success")
  }

  // Rasmni kattalashtirib ko'rish
  const openImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl)
  }

  // Rasm ko'rishni yopish
  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  // Validatsiya
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "To'yxona nomi kiritilishi shart"
    }

    if (!formData.district_id) {
      newErrors.district_id = "Tumanni tanlang"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Manzil kiritilishi shart"
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Sig'im musbat son bo'lishi kerak"
    }

    if (!formData.price_seat || formData.price_seat <= 0) {
      newErrors.price_seat = "Narx musbat son bo'lishi kerak"
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Telefon raqam kiritilishi shart"
    } else if (!/^\+998\d{9}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak"
    }

    if (images.length === 0) {
      newErrors.images = "Kamida bitta rasm yuklang"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form yuborish
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast("Iltimos, barcha maydonlarni to'g'ri to'ldiring", "error")
      return
    }

    setLoading(true)

    try {
      // Token olish (localStorage dan yoki cookies dan)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      if (!token) {
        throw new Error("Tizimga kirish uchun token topilmadi")
      }

      // FormData yaratish
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name.trim())
      formDataToSend.append("district_id", formData.district_id)
      formDataToSend.append("address", formData.address.trim())
      formDataToSend.append("capacity", formData.capacity)
      formDataToSend.append("price_seat", formData.price_seat)
      formDataToSend.append("phone_number", formData.phone_number.trim())

      // Rasmlarni qo'shish
      images.forEach((image) => {
        formDataToSend.append("images", image.file)
      })

      // Debug: FormData ni tekshirish
      console.log("Yuborilayotgan ma'lumotlar:")
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1])
      }

      // API ga so'rov yuborish
      const response = await fetch("http://localhost:4000/owner/reg-owner", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type ni qo'ymaslik kerak, browser o'zi qo'yadi multipart/form-data uchun
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Server xatosi: ${response.status}`)
      }

      // Muvaffaqiyatli yuborildi
      showToast(data.message || "To'yxona muvaffaqiyatli qo'shildi", "success")

      // Formni tozalash
      setFormData({
        name: "",
        district_id: "",
        address: "",
        capacity: "",
        price_seat: "",
        phone_number: "",
      })

      // Rasmlarni tozalash
      images.forEach((image) => URL.revokeObjectURL(image.preview))
      setImages([])
      setErrors({})
    } catch (error) {
      console.error("Xatolik:", error)
      showToast(error.message || "Xatolik yuz berdi", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      {/* Compact Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 py-8 md:py-12">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Yangi To'yxona Qo'shish</h1>
            <p className="text-purple-100 max-w-xl mx-auto">
              Yangi to'yxona ma'lumotlarini kiriting va ro'yxatga qo'shing
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
                <div className="flex items-center">
                  <Building2 className="w-6 h-6 text-white mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-white">To'yxona Ma'lumotlari</h2>
                    <p className="text-purple-100 text-sm mt-1">Barcha maydonlarni to'ldiring</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  {/* To'yxona nomi */}
                  <div className="space-y-1">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Building2 className="w-4 h-4 mr-2 text-purple-500" />
                      To'yxona nomi
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Masalan: Guliston To'yxonasi"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-400"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    />
                    {errors.name && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Tuman va Manzil */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        Tuman
                      </label>
                      <select
                        name="district_id"
                        value={formData.district_id}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.district_id ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-400"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                      >
                        <option value="">Tumanni tanlang</option>
                        {tashkentDistricts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.district_id && (
                        <div className="flex items-center text-red-600 text-xs mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.district_id}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-pink-500" />
                        Telefon raqam
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        placeholder="+998901234567"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.phone_number ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-400"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                      />
                      {errors.phone_number && (
                        <div className="flex items-center text-red-600 text-xs mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.phone_number}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manzil */}
                  <div className="space-y-1">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-green-500" />
                      Manzil
                    </label>
                    <textarea
                      name="address"
                      placeholder="To'liq manzilni kiriting"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                        errors.address ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-400"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    />
                    {errors.address && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.address}
                      </div>
                    )}
                  </div>

                  {/* Sig'im va Narx */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-indigo-500" />
                        Sig'im (kishi)
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        placeholder="300"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.capacity ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-400"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                      />
                      {errors.capacity && (
                        <div className="flex items-center text-red-600 text-xs mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.capacity}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                        Narx (so'm)
                      </label>
                      <input
                        type="number"
                        name="price_seat"
                        placeholder="150000"
                        value={formData.price_seat}
                        onChange={handleChange}
                        min="1"
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.price_seat ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-400"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                      />
                      {errors.price_seat && (
                        <div className="flex items-center text-red-600 text-xs mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.price_seat}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rasm Yuklash */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Upload className="w-4 h-4 mr-2 text-purple-500" />
                        Rasmlar
                      </label>
                      <span className="text-xs text-gray-500">{images.length}/5 rasm</span>
                    </div>
                    <div
                      onClick={handleImageUpload}
                      className={`border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        loading
                          ? "border-purple-300/30 bg-gray-50"
                          : "border-purple-400 bg-purple-50/50 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                    >
                      <Upload className="h-6 w-6 text-purple-500 mb-1" />
                      <p className="text-sm text-gray-700">Rasmlarni yuklash</p>
                      <p className="text-xs text-gray-500">JPG, PNG, GIF (max 5MB)</p>
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
                    {errors.images && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.images}
                      </div>
                    )}
                  </div>

                  {/* Yuklangan Rasmlar - Compact Grid */}
                  {images.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Yuklangan rasmlar</label>
                      <div className="grid grid-cols-5 gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative h-12 rounded-md overflow-hidden border border-purple-300">
                              <img
                                src={image.preview || "/placeholder.svg"}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => openImagePreview(image.preview)}
                                  className="p-1 bg-purple-500/80 rounded-full text-white mr-1"
                                >
                                  <Maximize2 className="h-2 w-2" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-1 bg-red-500/80 rounded-full text-white"
                                  disabled={loading}
                                >
                                  <Trash2 className="h-2 w-2" />
                                </button>
                              </div>
                            </div>
                            <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center border border-white">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          To'yxona Qo'shish
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 ml-2">Ma'lumot</h3>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                To'yxona qo'shgandan so'ng, u sizning shaxsiy kabinetingizda ko'rinadi va mijozlar uni bron qilishlari
                mumkin bo'ladi.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 ml-2">Maslahat</h3>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                To'yxona ma'lumotlarini to'liq va aniq kiriting. Bu mijozlarga to'g'ri tanlov qilishda yordam beradi.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-4 text-white">
              <h3 className="text-sm font-bold mb-2">Qo'shimcha xizmatlar</h3>
              <ul className="text-xs space-y-1">
                <li>• Professional fotosurat</li>
                <li>• Virtual tur</li>
                <li>• Marketing yordami</li>
                <li>• Mijozlar bilan aloqa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rasmni Kattalashtirib Ko'rish Modali */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-3xl max-h-[80vh] w-full">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-purple-400 transition-colors"
            >
              <X className="h-6 w-6" />
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
  )
}

export default AddVenues

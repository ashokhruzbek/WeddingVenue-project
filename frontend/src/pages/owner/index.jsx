"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Calendar,
  Shield,
  Clock,
  MapPin,
  Building,
  Settings,
  Edit,
  LogOut,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

function Owner() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    // Simulate loading
    setIsLoading(true)

    // Get user data from localStorage
    const userData = localStorage.getItem("user")

    setTimeout(() => {
      if (userData) {
        const parsedUser = JSON.parse(userData)

        // Enhance user data with additional fields if they don't exist
        const enhancedUser = {
          ...parsedUser,
          fullName:
            parsedUser.fullName ||
            `${parsedUser.firstname || ""} ${parsedUser.lastname || ""}`.trim() ||
            "Ism kiritilmagan",
          email: parsedUser.email || parsedUser.username || "Email yo'q",
          role: parsedUser.role || "Noma'lum",
          joinDate: parsedUser.joinDate || "2023-05-15T10:30:00",
          lastActive: parsedUser.lastActive || new Date().toISOString(),
          location: parsedUser.location || "Toshkent, O'zbekiston",
          stats: parsedUser.stats || {
            venues: 12,
            bookings: 48,
            reviews: 26,
            rating: 4.8,
          },
          verified: parsedUser.verified !== undefined ? parsedUser.verified : true,
        }

        setUser(enhancedUser)
      }
      setIsLoading(false)
    }, 800) // Simulate network delay
  }, [])

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return "Sana noma'lum"
    }
  }

  // Calculate time since last active
  const getTimeSince = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 60) return `${diffMins} daqiqa oldin`
      if (diffHours < 24) return `${diffHours} soat oldin`
      return `${diffDays} kun oldin`
    } catch (e) {
      return "Noma'lum"
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "owner":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "user":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield size={16} />
      case "owner":
        return <Building size={16} />
      default:
        return <User size={16} />
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-20 w-20"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No user data found
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Foydalanuvchi ma'lumotlari topilmadi</h2>
          <p className="text-gray-600 mb-6">
            Foydalanuvchi ma'lumotlari mavjud emas yoki sessiya muddati tugagan. Iltimos, qayta kiring.
          </p>
          <button
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
            onClick={() => (window.location.href = "/login")}
          >
            <LogOut className="inline mr-2" size={18} />
            Kirish sahifasiga o'tish
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Banner */}
          <div className="h-40 bg-gradient-to-r from-pink-500 to-rose-500 relative">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-2xl font-bold">Dashboard </h1>
              <p className="text-white/80">To'yxona.uz tizimi boshqaruvi</p>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-6 md:p-8 relative">
            {/* Profile Avatar */}
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 -mt-16 md:-mt-20 mb-4 md:mb-0 z-10">
                <motion.div
                  className="rounded-full h-24 w-24 md:h-32 md:w-32 bg-white p-1 shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className="rounded-full h-full w-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <motion.h2
                      className="text-2xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {user.fullName}
                    </motion.h2>
                    <motion.div
                      className="flex items-center mt-1 text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Mail className="mr-2" size={16} />
                      {user.email}
                    </motion.div>
                  </div>

                  <motion.div
                    className="mt-4 md:mt-0 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className={`flex items-center px-3 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 font-medium">
                        {user.role === "admin"
                          ? "Administrator"
                          : user.role === "owner"
                            ? "To'yxona egasi"
                            : user.role === "user"
                              ? "Foydalanuvchi"
                              : user.role}
                      </span>
                    </div>

                    {user.verified && (
                      <div className="ml-2 flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <CheckCircle size={14} className="mr-1" />
                        <span className="text-xs font-medium">Tasdiqlangan</span>
                      </div>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="bg-gray-50 rounded-xl p-4 border border-gray-100" variants={itemVariants}>
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
                        <Calendar size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">A'zo bo'lgan sana</div>
                        <div className="font-medium">{formatDate(user.joinDate)}</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="bg-gray-50 rounded-xl p-4 border border-gray-100" variants={itemVariants}>
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Clock size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Oxirgi faollik</div>
                        <div className="font-medium">{getTimeSince(user.lastActive)}</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="bg-gray-50 rounded-xl p-4 border border-gray-100" variants={itemVariants}>
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <MapPin size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Joylashuv</div>
                        <div className="font-medium">{user.location}</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "profile"
                      ? "text-pink-600 border-b-2 border-pink-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={16} className="inline mr-1" />
                  Profil ma'lumotlari
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "stats"
                      ? "text-pink-600 border-b-2 border-pink-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("stats")}
                >
                  <Activity size={16} className="inline mr-1" />
                  Statistika
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "settings"
                      ? "text-pink-600 border-b-2 border-pink-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings size={16} className="inline mr-1" />
                  Sozlamalar
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Shaxsiy ma'lumotlar</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">To'liq ism</div>
                            <div className="font-medium">{user.fullName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Email</div>
                            <div className="font-medium">{user.email}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Telefon</div>
                            <div className="font-medium">{user.phone || "Kiritilmagan"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Joylashuv</div>
                            <div className="font-medium">{user.location}</div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <button className="flex items-center text-pink-600 hover:text-pink-700 font-medium">
                            <Edit size={16} className="mr-1" />
                            Ma'lumotlarni tahrirlash
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Tizim ma'lumotlari</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Foydalanuvchi turi</div>
                            <div className="font-medium flex items-center">
                              {getRoleIcon(user.role)}
                              <span className="ml-1">
                                {user.role === "admin"
                                  ? "Administrator"
                                  : user.role === "owner"
                                    ? "To'yxona egasi"
                                    : user.role === "user"
                                      ? "Foydalanuvchi"
                                      : user.role}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">A'zo bo'lgan sana</div>
                            <div className="font-medium">{formatDate(user.joinDate)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Oxirgi faollik</div>
                            <div className="font-medium">{getTimeSince(user.lastActive)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Hisob holati</div>
                            <div className="font-medium flex items-center">
                              {user.verified ? (
                                <>
                                  <CheckCircle size={16} className="mr-1 text-green-500" />
                                  <span>Tasdiqlangan</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle size={16} className="mr-1 text-amber-500" />
                                  <span>Tasdiqlanmagan</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "stats" && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">To'yxonalar</p>
                            <h4 className="text-2xl font-bold mt-1">{user.stats?.venues || 0}</h4>
                          </div>
                          <div className="p-3 bg-pink-100 rounded-lg">
                            <Building className="text-pink-600" size={24} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Buyurtmalar</p>
                            <h4 className="text-2xl font-bold mt-1">{user.stats?.bookings || 0}</h4>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar className="text-blue-600" size={24} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Sharhlar</p>
                            <h4 className="text-2xl font-bold mt-1">{user.stats?.reviews || 0}</h4>
                          </div>
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Activity className="text-purple-600" size={24} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Reyting</p>
                            <h4 className="text-2xl font-bold mt-1">{user.stats?.rating || 0}/5</h4>
                          </div>
                          <div className="p-3 bg-amber-100 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 text-amber-600"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Faollik tarixi</h3>
                      <p className="text-gray-600 mb-4">
                        Bu yerda foydalanuvchining tizimda faoliyati bo'yicha batafsil ma'lumotlar ko'rsatiladi.
                        Statistika ma'lumotlari, grafik ko'rinishidagi hisobotlar va boshqa muhim ko'rsatkichlar.
                      </p>

                      <div className="flex justify-center items-center h-48 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">Faollik grafigi uchun joy</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Profil sozlamalari</h3>
                      <p className="text-gray-600 mb-6">
                        Bu yerda foydalanuvchi profilini sozlash imkoniyatlari ko'rsatiladi. Parolni o'zgartirish,
                        bildirishnomalar sozlamalari va boshqa shaxsiy sozlamalar.
                      </p>

                      <div className="space-y-4">
                        <button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Parolni o'zgartirish
                        </button>

                        <button className="w-full sm:w-auto ml-0 sm:ml-2 mt-2 sm:mt-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                          Bildirishnomalar sozlamalari
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Owner

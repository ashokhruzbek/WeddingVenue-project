"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, ChevronDown, ChevronUp, Heart } from "lucide-react"

const AllDistricts = () => {
  const [districts, setDistricts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setIsLoading(true)

    // Static districts list
    const staticDistricts = [
      { id: 1, name: "Yunusobod", region: "Toshkent", venueCount: 24, popularity: 92 },
      { id: 2, name: "Chilonzor", region: "Toshkent", venueCount: 31, popularity: 95 },
      { id: 3, name: "Shayxontohur", region: "Toshkent", venueCount: 18, popularity: 87 },
      { id: 4, name: "Uchtepa", region: "Toshkent", venueCount: 15, popularity: 82 },
      { id: 5, name: "Olmazor", region: "Toshkent", venueCount: 22, popularity: 88 },
      { id: 6, name: "Yakkasaroy", region: "Toshkent", venueCount: 19, popularity: 90 },
      { id: 7, name: "Yashnobod", region: "Toshkent", venueCount: 17, popularity: 85 },
      { id: 8, name: "Bektemir", region: "Toshkent", venueCount: 9, popularity: 75 },
      { id: 9, name: "Mirobod", region: "Toshkent", venueCount: 28, popularity: 93 },
      { id: 10, name: "Mirzo Ulug'bek", region: "Toshkent", venueCount: 26, popularity: 91 },
      { id: 11, name: "Sergeli", region: "Toshkent", venueCount: 14, popularity: 80 },
      { id: 12, name: "Yangihayot", region: "Toshkent", venueCount: 12, popularity: 78 },
    ]

    setTimeout(() => {
      setDistricts(staticDistricts)
      setIsLoading(false)
    }, 800) // Simulate network delay
  }, [])

  // Sort function
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort districts
  const filteredAndSortedDistricts = [...districts]
    .filter((district) => {
      const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = selectedRegion === "all" || district.region === selectedRegion
      return matchesSearch && matchesRegion
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
      }
      return 0
    })

  // Get unique regions
  const regions = ["all", ...new Set(districts.map((district) => district.region))]

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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.2 },
    },
  }

  // Function to get popularity color
  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return "bg-green-500"
    if (popularity >= 80) return "bg-blue-500"
    if (popularity >= 70) return "bg-yellow-500"
    return "bg-gray-500"
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={headerVariants}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <MapPin className="mr-2 text-pink-500" size={28} />
              Barcha tumanlar
            </h1>
            <p className="mt-2 text-gray-600">To'yxonalar joylashgan tumanlar ro'yxati</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tuman nomini qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none w-full sm:w-64"
              />
            </div>

            {/* Region filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "all" ? "Barcha viloyatlar" : region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-4 text-white shadow-lg"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h3 className="text-lg font-semibold opacity-80">Jami tumanlar</h3>
            <p className="text-3xl font-bold mt-2">{districts.length}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h3 className="text-lg font-semibold opacity-80">Jami to'yxonalar</h3>
            <p className="text-3xl font-bold mt-2">
              {districts.reduce((sum, district) => sum + district.venueCount, 0)}
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h3 className="text-lg font-semibold opacity-80">O'rtacha to'yxonalar</h3>
            <p className="text-3xl font-bold mt-2">
              {Math.round(districts.reduce((sum, district) => sum + district.venueCount, 0) / (districts.length || 1))}
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-lg"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h3 className="text-lg font-semibold opacity-80">Eng mashhur tuman</h3>
            <p className="text-3xl font-bold mt-2">
              {districts.length > 0
                ? districts.reduce((max, district) => (district.popularity > max.popularity ? district : max)).name
                : "—"}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Districts table/grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
            <Heart
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500"
              size={20}
            />
          </div>
        </div>
      ) : filteredAndSortedDistricts.length === 0 ? (
        <motion.div
          className="bg-pink-50 border border-pink-200 text-pink-700 px-4 py-8 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MapPin className="mx-auto mb-2" size={32} />
          <p className="text-lg font-medium">Hech qanday tuman topilmadi</p>
          <p className="text-sm mt-1">
            Qidiruv so'rovingizni o'zgartiring yoki barcha tumanlarni ko'rish uchun filterni tiklang
          </p>
        </motion.div>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-hidden rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === "id" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Nomi
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("region")}
                  >
                    <div className="flex items-center">
                      Viloyat
                      {sortConfig.key === "region" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("venueCount")}
                  >
                    <div className="flex items-center">
                      To'yxonalar soni
                      {sortConfig.key === "venueCount" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("popularity")}
                  >
                    <div className="flex items-center">
                      Mashhurlik
                      {sortConfig.key === "popularity" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  component="span"
                  className="contents"
                >
                  {filteredAndSortedDistricts.map((district, index) => (
                    <motion.tr
                      key={district.id}
                      variants={itemVariants}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-pink-50 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <MapPin className="mr-2 text-pink-500" size={16} />
                        {district.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{district.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {district.venueCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                            <div
                              className={`h-2.5 rounded-full ${getPopularityColor(district.popularity)}`}
                              style={{ width: `${district.popularity}%` }}
                            ></div>
                          </div>
                          <span>{district.popularity}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.div>
              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <motion.div
            className="grid grid-cols-1 gap-4 md:hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedDistricts.map((district) => (
              <motion.div
                key={district.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <MapPin className="text-pink-500" size={20} />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                        <p className="text-sm text-gray-600">{district.region}</p>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ID: {district.id}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">To'yxonalar soni</span>
                        <span className="font-medium text-pink-600">{district.venueCount}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Mashhurlik</span>
                        <span className="font-medium">{district.popularity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPopularityColor(district.popularity)}`}
                          style={{ width: `${district.popularity}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}

export default AllDistricts

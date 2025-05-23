 


 
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Info, ChevronRight, Building2, Users, Trees, Coffee, ShoppingBag } from "lucide-react"

const districts = [
  {
    name: "Bektemir",
    description: "Sanoat va logistika markazi",
    color: "from-amber-500 to-orange-600",
    icon: <Building2 className="h-6 w-6" />,
    fact: "Toshkentning eng janubiy tumani",
    population: "~30,000",
  },
  {
    name: "Mirzo Ulug'bek",
    description: "Ilm-fan va ta'lim markazi",
    color: "from-blue-500 to-indigo-600",
    icon: <Users className="h-6 w-6" />,
    fact: "Ko'plab universitetlar joylashgan",
    population: "~250,000",
  },
  {
    name: "Mirobod",
    description: "Biznes va transport markazi",
    color: "from-purple-500 to-violet-600",
    icon: <ShoppingBag className="h-6 w-6" />,
    fact: "Markaziy temir yo'l vokzali joylashgan",
    population: "~130,000",
  },
  {
    name: "Olmazor",
    description: "Tarixiy va madaniy markaz",
    color: "from-green-500 to-emerald-600",
    icon: <Trees className="h-6 w-6" />,
    fact: "Ilgari Sobir Rahimov tumani deb atalgan",
    population: "~340,000",
  },
  {
    name: "Sergeli",
    description: "Yangi rivojlanayotgan hududlar",
    color: "from-yellow-500 to-amber-600",
    icon: <Building2 className="h-6 w-6" />,
    fact: "Toshkent shahrining janubiy qismida joylashgan",
    population: "~220,000",
  },
  {
    name: "Uchtepa",
    description: "Aholi zich joylashgan tumanlardan biri",
    color: "from-red-500 to-rose-600",
    icon: <Users className="h-6 w-6" />,
    fact: "Toshkentning g'arbiy qismida joylashgan",
    population: "~280,000",
  },
  {
    name: "Chilonzor",
    description: "Eng katta va gavjum tumanlardan biri",
    color: "from-sky-500 to-blue-600",
    icon: <ShoppingBag className="h-6 w-6" />,
    fact: "Toshkentning eng katta tumani hisoblanadi",
    population: "~450,000",
  },
  {
    name: "Shayxontohur",
    description: "Tarixiy va madaniy meros markazi",
    color: "from-teal-500 to-emerald-600",
    icon: <Coffee className="h-6 w-6" />,
    fact: "Ko'plab tarixiy obidalar joylashgan",
    population: "~300,000",
  },
  {
    name: "Yashnobod",
    description: "Sanoat va ishlab chiqarish markazi",
    color: "from-cyan-500 to-blue-600",
    icon: <Building2 className="h-6 w-6" />,
    fact: "Ilgari Hamza tumani deb atalgan",
    population: "~200,000",
  },
  {
    name: "Yunusobod",
    description: "Zamonaviy turar-joy majmualari",
    color: "from-fuchsia-500 to-purple-600",
    icon: <Building2 className="h-6 w-6" />,
    fact: "Toshkentning shimoliy qismida joylashgan",
    population: "~330,000",
  },
  {
    name: "Yakkasaroy",
    description: "Markaziy biznes tumani",
    color: "from-pink-500 to-rose-600",
    icon: <ShoppingBag className="h-6 w-6" />,
    fact: "Ko'plab elchixonalar joylashgan",
    population: "~120,000",
  },
  {
    name: "Yangihayot",
    description: "Eng yangi va tez rivojlanayotgan tuman",
    color: "from-lime-500 to-green-600",
    icon: <Trees className="h-6 w-6" />,
    fact: "2020-yilda tashkil etilgan",
    population: "~70,000",
  },
]

function AllDistricts() {
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid, map, or list

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district)
  }

  const closeDetails = () => {
    setSelectedDistrict(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Toshkent Shahri Tumanlari
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              O'zbekiston poytaxti Toshkent shahri 12 ta ma'muriy tumanga bo'lingan. Har bir tumanning o'ziga xos
              xususiyatlari va diqqatga sazovor joylari mavjud.
            </p>
          </motion.div>

          {/* View mode switcher */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Grid ko'rinish
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Xarita ko'rinish
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Ro'yxat ko'rinish
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {districts.map((district, index) => (
              <motion.div
                key={district.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => handleDistrictClick(district)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
                  <div className={`h-3 bg-gradient-to-r ${district.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${district.color} text-white`}>
                        {district.icon}
                      </div>
                      <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        {district.population}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{district.name}</h3>
                    <p className="text-gray-600 text-sm">{district.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        Toshkent
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                        Batafsil
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Map View */}
        {viewMode === "map" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="aspect-[16/9] relative">
              {/* Stylized map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M200,100 Q400,50 600,150 T900,200 Q950,350 800,400 T500,450 Q300,500 200,400 T100,200 Q150,150 200,100"
                    stroke="#e0e7ff"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M250,150 Q450,100 650,200 T850,250 Q900,400 750,450 T450,500 Q250,550 150,450 T50,250 Q100,200 250,150"
                    stroke="#c7d2fe"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* District pins */}
              {districts.map((district, index) => {
                // Calculate position (this is just for visualization, not accurate)
                const x = 150 + (index % 4) * 200 + Math.floor(index / 4) * 50
                const y = 100 + Math.floor(index / 4) * 150

                return (
                  <motion.div
                    key={district.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="absolute cursor-pointer"
                    style={{ left: `${x}px`, top: `${y}px` }}
                    onClick={() => handleDistrictClick(district)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${district.color} shadow-lg flex items-center justify-center text-white`}
                    >
                      {district.icon}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium whitespace-nowrap">
                      {district.name}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Toshkent shahri xaritasi</h3>
              <p className="text-gray-600 text-sm">
                Yuqoridagi xaritada Toshkent shahrining tumanlari ko'rsatilgan. Har bir tuman haqida ma'lumot olish
                uchun belgilarga bosing.
              </p>
            </div>
          </motion.div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="divide-y divide-gray-100">
              {districts.map((district, index) => (
                <motion.div
                  key={district.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleDistrictClick(district)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${district.color} flex items-center justify-center text-white mr-4`}
                      >
                        {district.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{district.name}</h3>
                        <p className="text-sm text-gray-500">{district.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm text-gray-500 mr-4">{district.population}</div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* District Details Modal */}
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`h-2 bg-gradient-to-r ${selectedDistrict.color}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedDistrict.color} text-white mr-4`}>
                      {selectedDistrict.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedDistrict.name}</h2>
                      <p className="text-gray-600">{selectedDistrict.description}</p>
                    </div>
                  </div>
                  <button onClick={closeDetails} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Qiziqarli ma'lumot</h3>
                        <p className="text-gray-600 mt-1">{selectedDistrict.fact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Aholi soni</h3>
                        <p className="text-gray-600 mt-1">{selectedDistrict.population} kishi</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Joylashuvi</h3>
                        <p className="text-gray-600 mt-1">Toshkent shahri, O'zbekiston</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={closeDetails}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${selectedDistrict.color} text-white font-medium hover:opacity-90 transition-opacity`}
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AllDistricts

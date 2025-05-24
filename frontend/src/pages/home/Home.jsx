import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Users, DollarSign, Phone, Filter } from "lucide-react";
import { toast } from "react-toastify";

function Home() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
 const navigate = useNavigate();

const handleClickCheck = () => {
    if (!token) {
      toast.error("Iltimos, avval tizimga kiring!", {
        duration: 3000,
        position: "top-right",
        richColors: true,
        action: {
          label: "Kirish",
          onClick: () => navigate("/login"),
        },
      });
      navigate("/login");
    }
  };
 

  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:4000/venues"
        );
        setVenues(res.data.venues);
        setFilteredVenues(res.data.venues);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const result = venues.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDistrict =
        districtFilter === "all" ||
        item.district_id === Number.parseInt(districtFilter);
      return matchesSearch && matchesDistrict;
    });
    setFilteredVenues(result);
  }, [search, districtFilter, venues]);

  const handleClick = (id) => {
    navigate(`/booking/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-2 text-blue-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          To'yxonalar
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Toshkent shahridagi eng yaxshi to'yxonalarni toping va band qiling
        </motion.p>

        {/* Search and Filter Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Qidiruv (nomi bo'yicha)..."
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-1/3">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="all">Barcha tumanlar</option>
                <option value="bektemir">Bektemir</option>
                <option value="mirzo_ulugbek">Mirzo Ulugʻbek</option>
                <option value="mirobod">Mirobod</option>
                <option value="olmazor">Olmazor</option>
                <option value="sergeli">Sergeli</option>
                <option value="shayxontohur">Shayxontohur</option>
                <option value="uchtepa">Uchtepa</option>
                <option value="chilonzor">Chilonzor</option>
                <option value="yunusobod">Yunusobod</option>
                <option value="yakkasaroy">Yakkasaroy</option>
                <option value="yangihayot">Yangihayot</option>
                <option value="bekobod">Bekobod</option>
                <option value="boʻka">Boʻka</option>
                <option value="qibray">Qibray</option>
                <option value="zangiota">Zangiota</option>
                <option value="yangiyoʻl">Yangiyoʻl</option>
                <option value="nurafshon">Nurafshon (shahar)</option>
                <option value="parkent">Parkent</option>
                <option value="ohangaron">Ohangaron</option>
                <option value="piskent">Piskent</option>
                <option value="olmaliq">Olmaliq (shahar)</option>
                <option value="angren">Angren (shahar)</option>
                <option value="chinoz">Chinoz</option>
                <option value="oroltog">O‘rta Chirchiq</option>
                <option value="quyichirchiq">Quyi Chirchiq</option>
                <option value="yuqorichirchiq">Yuqori Chirchiq</option>
                <option value="toshkent_vil_shahar">
                  
                </option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <p className="text-gray-600 font-medium">
            {filteredVenues.length} ta natija topildi
          </p>
        </motion.div>

        {/* Venue Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVenues.length === 0 ? (
                <motion.p
                  className="text-center col-span-full text-lg text-gray-500 py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Hech narsa topilmadi...
                </motion.p>
              ) : (
                filteredVenues.map((toy) => (
                  <motion.div
                    key={toy.id}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer"
                    layoutId={`venue-${toy.id}`}
                  >
                    <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <motion.h3
                          className="text-2xl font-bold text-white mb-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {toy.name}
                        </motion.h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={18}
                        />
                        <p className="text-gray-700">{toy.address}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={18}
                        />
                        <p className="text-gray-700">
                          <span className="font-semibold">{toy.capacity}</span>{" "}
                          kishi
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={18}
                        />
                        <p className="text-gray-700">
                          <span className="font-semibold">
                            {toy.price_seat}
                          </span>{" "}
                          ming so'm
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone
                          className="text-blue-500 shrink-0 mt-0.5"
                          size={18}
                        />
                        <p className="text-gray-700">{toy.phone_number}</p>
                      </div>

                      <motion.button onClick={handleClickCheck}
                        className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Band qilish
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../../components/shared/StatsCard";
import { CardSkeleton } from "../../components/shared/LoadingComponents";

// MUI Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarRateIcon from '@mui/icons-material/StarRate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    favoriteVenues: 0,
    myBookings: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    const userData = localStorage.getItem("user");

    setTimeout(() => {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          fullName: `${parsedUser.firstname || ""} ${parsedUser.lastname || ""}`.trim() || "Foydalanuvchi",
          role: parsedUser.role || "user",
        });
      }

      // Mock stats - replace with API call
      setStats({
        favoriteVenues: 12,
        myBookings: 3,
        upcomingEvents: 1,
      });

      setIsLoading(false);
    }, 800);
  }, []);

  const quickActions = [
    {
      title: "To'yxonalar",
      icon: LocationCityIcon,
      link: "/user/venues",
      color: "#D4AF37",
      bgGradient: "from-[#D4AF37] to-[#c49a2c]",
      description: "Barcha to'yxonalarni ko'rish",
    },
    {
      title: "Sevimlilar",
      icon: FavoriteIcon,
      link: "/user/favorites",
      color: "#EF4444",
      bgGradient: "from-[#EF4444] to-[#DC2626]",
      description: "Saqlanganlarim",
    },
    {
      title: "Buyurtmalarim",
      icon: CalendarTodayIcon,
      link: "/user/bookings",
      color: "#3B82F6",
      bgGradient: "from-[#3B82F6] to-[#2563EB]",
      description: "Mening buyurtmalarim",
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      venueName: "Grand Palace",
      date: "2024-12-25",
      time: "18:00",
      guests: 300,
      status: "confirmed",
    },
  ];

  const recommendedVenues = [
    {
      id: 1,
      name: "Royal Garden",
      location: "Toshkent, Chilonzor",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80",
    },
    {
      id: 2,
      name: "Crystal Hall",
      location: "Toshkent, Yunusobod",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
    },
    {
      id: 3,
      name: "Paradise Palace",
      location: "Samarqand",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&q=80",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
          </div>
          <CardSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-lg">
              <FavoriteIcon sx={{ fontSize: 28, color: 'white' }} />
            </div>
            <div>
              <h1
                className="text-3xl md:text-4xl font-semibold text-[#1E3A5F]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Xush kelibsiz, {user?.fullName}!
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <CelebrationIcon sx={{ fontSize: 16 }} />
                Orzuyingizdagi to'yni rejalashtiring
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Sevimli To'yxonalar"
            value={stats.favoriteVenues}
            icon={FavoriteIcon}
            color="#EF4444"
            bgGradient="from-[#EF4444] to-[#DC2626]"
            delay={0}
          />
          <StatsCard
            title="Mening Buyurtmalarim"
            value={stats.myBookings}
            icon={CalendarTodayIcon}
            color="#3B82F6"
            bgGradient="from-[#3B82F6] to-[#2563EB]"
            delay={0.1}
          />
          <StatsCard
            title="Yaqinlashayotgan"
            value={stats.upcomingEvents}
            icon={EventAvailableIcon}
            color="#10B981"
            bgGradient="from-[#10B981] to-[#059669]"
            delay={0.2}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUpIcon className="text-[#D4AF37]" sx={{ fontSize: 24 }} />
            <h2
              className="text-2xl font-semibold text-[#1E3A5F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Tezkor Havolalar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${action.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <action.icon sx={{ fontSize: 32, color: 'white' }} />
                  </div>
                  <h3 className="text-[#1E3A5F] font-semibold text-lg mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <EventAvailableIcon className="text-[#D4AF37]" sx={{ fontSize: 24 }} />
              <h2
                className="text-2xl font-semibold text-[#1E3A5F]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Yaqinlashayotgan Tadbirlar
              </h2>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#c49a2c]/10 border border-[#D4AF37]/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-[#1E3A5F] font-semibold text-lg mb-1">{booking.venueName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                            {booking.date}
                          </span>
                          <span>⏰ {booking.time}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Tasdiqlangan
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>👥 {booking.guests} mehmon</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CelebrationIcon sx={{ fontSize: 48, color: '#D4AF37', opacity: 0.3 }} />
                <p className="text-gray-500 mt-4">Hozircha buyurtmalaringiz yo'q</p>
                <Link
                  to="/user/venues"
                  className="inline-flex items-center gap-2 mt-4 text-[#D4AF37] hover:text-[#c49a2c] font-medium"
                >
                  To'yxonalarni ko'rish
                  <SearchIcon sx={{ fontSize: 18 }} />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recommended Venues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AutoAwesomeIcon className="text-[#D4AF37]" sx={{ fontSize: 24 }} />
                <h2
                  className="text-2xl font-semibold text-[#1E3A5F]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Tavsiya Etamiz
                </h2>
              </div>
              <Link
                to="/user/venues"
                className="text-sm text-[#D4AF37] hover:text-[#c49a2c] font-medium transition-colors"
              >
                Barchasi →
              </Link>
            </div>

            <div className="space-y-4">
              {recommendedVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#1E3A5F] font-semibold mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {venue.name}
                    </h4>
                    <p className="text-gray-600 text-sm flex items-center gap-1 mb-1">
                      <LocationOnIcon sx={{ fontSize: 14 }} />
                      {venue.location}
                    </p>
                    <div className="flex items-center gap-1">
                      <StarRateIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                      <span className="text-sm font-medium text-gray-700">{venue.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10">
            <CelebrationIcon sx={{ fontSize: 200 }} />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FavoriteIcon sx={{ fontSize: 32, color: 'white' }} />
            </div>
            <div className="flex-1">
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Orzuyingizdagi To'y
              </h3>
              <p className="text-white/90">
                Biz sizning hayotimizdagi eng muhim kunni unutilmas qilishga tayyormiz. To'yxonangizni tanlang va maxsus takliflardan foydalaning!
              </p>
              <Link
                to="/user/venues"
                className="inline-flex items-center gap-2 mt-4 bg-white text-[#D4AF37] px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                <SearchIcon sx={{ fontSize: 20 }} />
                To'yxona tanlash
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default UserDashboard;

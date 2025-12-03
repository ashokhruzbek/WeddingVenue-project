import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../../components/shared/StatsCard";
import { CardSkeleton } from "../../components/shared/LoadingComponents";

// MUI Icons
import DiamondIcon from '@mui/icons-material/Diamond';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarRateIcon from '@mui/icons-material/StarRate';
import PeopleIcon from '@mui/icons-material/People';

function OwnerDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    myVenues: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    const userData = localStorage.getItem("user");

    setTimeout(() => {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          fullName: `${parsedUser.firstname || ""} ${parsedUser.lastname || ""}`.trim() || "Owner",
          role: parsedUser.role || "owner",
        });
      }

      // Mock stats - replace with API call
      setStats({
        myVenues: 5,
        totalBookings: 143,
        monthlyRevenue: 85000000,
        pendingBookings: 8,
      });

      setIsLoading(false);
    }, 800);
  }, []);

  const quickActions = [
    {
      title: "Yangi To'yxona",
      icon: AddCircleIcon,
      link: "/owner/reg-owner",
      color: "#D4AF37",
      bgGradient: "from-[#D4AF37] to-[#c49a2c]",
    },
    {
      title: "To'yxonalarim",
      icon: LocationCityIcon,
      link: "/owner/venues",
      color: "#3B82F6",
      bgGradient: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "Yangilash",
      icon: EditIcon,
      link: "/owner/update-venue",
      color: "#10B981",
      bgGradient: "from-[#10B981] to-[#059669]",
    },
    {
      title: "Buyurtmalar",
      icon: EventNoteIcon,
      link: "/owner/bookings",
      color: "#F59E0B",
      bgGradient: "from-[#F59E0B] to-[#D97706]",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      venueName: "Grand Palace",
      clientName: "Aziza & Jasur",
      date: "2024-12-25",
      status: "confirmed",
      amount: "15,000,000 UZS",
    },
    {
      id: 2,
      venueName: "Royal Garden",
      clientName: "Nilufar & Sardor",
      date: "2024-12-30",
      status: "pending",
      amount: "12,000,000 UZS",
    },
    {
      id: 3,
      venueName: "Crystal Hall",
      clientName: "Madina & Bobur",
      date: "2025-01-05",
      status: "confirmed",
      amount: "18,000,000 UZS",
    },
  ];

  const formatRevenue = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
          </div>
          <CardSkeleton count={4} />
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#c49a2c] flex items-center justify-center shadow-lg">
              <DiamondIcon sx={{ fontSize: 28, color: 'white' }} />
            </div>
            <div>
              <h1
                className="text-3xl md:text-4xl font-semibold text-[#1E3A5F]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Xush kelibsiz, {user?.fullName}!
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                To'yxona Egasi Dashboard
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Mening To'yxonalarim"
            value={stats.myVenues}
            icon={LocationCityIcon}
            color="#D4AF37"
            bgGradient="from-[#D4AF37] to-[#c49a2c]"
            delay={0}
          />
          <StatsCard
            title="Jami Buyurtmalar"
            value={stats.totalBookings}
            icon={CalendarTodayIcon}
            color="#3B82F6"
            bgGradient="from-[#3B82F6] to-[#2563EB]"
            trend="up"
            trendValue="+18%"
            delay={0.1}
          />
          <StatsCard
            title="Oylik Daromad"
            value={`${formatRevenue(stats.monthlyRevenue)} UZS`}
            icon={AttachMoneyIcon}
            color="#10B981"
            bgGradient="from-[#10B981] to-[#059669]"
            trend="up"
            trendValue="+25%"
            delay={0.2}
          />
          <StatsCard
            title="Kutilmoqda"
            value={stats.pendingBookings}
            icon={EventNoteIcon}
            color="#F59E0B"
            bgGradient="from-[#F59E0B] to-[#D97706]"
            delay={0.3}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUpIcon className="text-[#D4AF37]" sx={{ fontSize: 24 }} />
            <h2
              className="text-2xl font-semibold text-[#1E3A5F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Tezkor Amallar
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg mx-auto`}
                  >
                    <action.icon sx={{ fontSize: 28, color: 'white' }} />
                  </div>
                  <h3 className="text-center text-[#1E3A5F] font-semibold group-hover:text-[#D4AF37] transition-colors">
                    {action.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <EventNoteIcon className="text-[#D4AF37]" sx={{ fontSize: 24 }} />
              <h2
                className="text-2xl font-semibold text-[#1E3A5F]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                So'nggi Buyurtmalar
              </h2>
            </div>
            <Link
              to="/owner/bookings"
              className="text-sm text-[#D4AF37] hover:text-[#c49a2c] font-medium transition-colors"
            >
              Barchasini ko'rish →
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-gray-100"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#c49a2c] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LocationCityIcon sx={{ fontSize: 24, color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#1E3A5F] font-semibold mb-1">{booking.venueName}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <PeopleIcon sx={{ fontSize: 16 }} />
                        {booking.clientName}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        {booking.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#1E3A5F] font-semibold mb-1">{booking.amount}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status === "confirmed" ? "Tasdiqlangan" : "Kutilmoqda"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <StarRateIcon sx={{ fontSize: 32, color: 'white' }} />
            </div>
            <div className="flex-1">
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Muvaffaqiyatli Biznes
              </h3>
              <p className="text-white/90">
                To'yxonalaringizni samarali boshqaring va mijozlaringizga eng yaxshi xizmatni taqdim eting.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OwnerDashboard;

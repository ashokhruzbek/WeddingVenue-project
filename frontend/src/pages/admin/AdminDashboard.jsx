import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../../components/shared/StatsCard";
import { LoadingSpinner, CardSkeleton } from "../../components/shared/LoadingComponents";

// MUI Icons
import DiamondIcon from '@mui/icons-material/Diamond';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EventNoteIcon from '@mui/icons-material/EventNote';
import StarRateIcon from '@mui/icons-material/StarRate';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);

    // Get user data from localStorage
    const userData = localStorage.getItem("user");

    setTimeout(() => {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          fullName: `${parsedUser.firstname || ""} ${parsedUser.lastname || ""}`.trim() || "Admin",
          role: parsedUser.role || "admin",
        });
      }

      // Mock stats data - replace with API call
      setStats({
        totalVenues: 156,
        totalUsers: 1247,
        totalBookings: 892,
        pendingApprovals: 23,
      });

      setIsLoading(false);
    }, 800);
  }, []);

  const quickActions = [
    {
      title: "Yangi To'yxona",
      icon: LocationCityIcon,
      link: "/admin/create-venue",
      color: "#D4AF37",
      bgGradient: "from-[#D4AF37] to-[#c49a2c]",
    },
    {
      title: "Egasi Qo'shish",
      icon: PersonIcon,
      link: "/admin/create-owner",
      color: "#3B82F6",
      bgGradient: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      title: "Tasdiqlash",
      icon: VerifiedIcon,
      link: "/admin/approve-venue",
      color: "#10B981",
      bgGradient: "from-[#10B981] to-[#059669]",
    },
    {
      title: "Buyurtmalar",
      icon: EventNoteIcon,
      link: "/admin/bookings",
      color: "#F59E0B",
      bgGradient: "from-[#F59E0B] to-[#D97706]",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "venue_created",
      title: "Yangi to'yxona qo'shildi",
      description: "Samarqand Palace to'yxonasi tizimga qo'shildi",
      time: "10 daqiqa oldin",
      icon: LocationCityIcon,
      color: "#D4AF37",
    },
    {
      id: 2,
      type: "booking",
      title: "Yangi buyurtma",
      description: "Grand Hall uchun yangi buyurtma qabul qilindi",
      time: "1 soat oldin",
      icon: CalendarTodayIcon,
      color: "#3B82F6",
    },
    {
      id: 3,
      type: "approval",
      title: "To'yxona tasdiqlandi",
      description: "Royal Garden to'yxonasi tasdiqlandi",
      time: "2 soat oldin",
      icon: VerifiedIcon,
      color: "#10B981",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center shadow-lg">
              <DiamondIcon sx={{ fontSize: 28, color: '#D4AF37' }} />
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
                Admin Dashboard
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Jami To'yxonalar"
            value={stats.totalVenues}
            icon={LocationCityIcon}
            color="#D4AF37"
            bgGradient="from-[#D4AF37] to-[#c49a2c]"
            trend="up"
            trendValue="+12%"
            delay={0}
          />
          <StatsCard
            title="Foydalanuvchilar"
            value={stats.totalUsers}
            icon={PeopleIcon}
            color="#3B82F6"
            bgGradient="from-[#3B82F6] to-[#2563EB]"
            trend="up"
            trendValue="+8%"
            delay={0.1}
          />
          <StatsCard
            title="Jami Buyurtmalar"
            value={stats.totalBookings}
            icon={CalendarTodayIcon}
            color="#10B981"
            bgGradient="from-[#10B981] to-[#059669]"
            trend="up"
            trendValue="+23%"
            delay={0.2}
          />
          <StatsCard
            title="Kutilmoqda"
            value={stats.pendingApprovals}
            icon={PendingIcon}
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

        {/* Recent Activities */}
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
                So'nggi Faoliyat
              </h2>
            </div>
            <Link
              to="/admin/venues"
              className="text-sm text-[#D4AF37] hover:text-[#c49a2c] font-medium transition-colors"
            >
              Barchasini ko'rish →
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  <activity.icon sx={{ fontSize: 24, color: activity.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[#1E3A5F] font-semibold mb-1">{activity.title}</h4>
                  <p className="text-gray-600 text-sm mb-1">{activity.description}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <StarRateIcon sx={{ fontSize: 32, color: '#D4AF37' }} />
            </div>
            <div className="flex-1">
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Professional Dashboard
              </h3>
              <p className="text-white/80">
                Barcha ma'lumotlar va tizim boshqaruvi bir joyda. Samarali ishlang va natijalarni kuzating.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "#D4AF37", 
  trend, 
  trendValue,
  bgGradient = "from-[#1E3A5F] to-[#2d4a6f]",
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <h3 
            className="text-3xl font-semibold text-[#1E3A5F] group-hover:text-[#D4AF37] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {value}
          </h3>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div 
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
        >
          <Icon sx={{ fontSize: 28, color: color }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

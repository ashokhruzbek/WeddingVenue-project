import { CircularProgress, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CelebrationIcon from '@mui/icons-material/Celebration';

// Simple Loading Spinner
export const LoadingSpinner = ({ size = 40, color = "#D4AF37" }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress 
        size={size} 
        sx={{ 
          color: color,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
    </Box>
  );
};

// Full Page Loading
export const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center mb-4 mx-auto animate-bounce shadow-xl">
            <AutoAwesomeIcon sx={{ fontSize: 40, color: '#D4AF37' }} />
          </div>
          <div className="absolute -top-2 -right-2">
            <CelebrationIcon className="text-[#D4AF37] animate-pulse" sx={{ fontSize: 24 }} />
          </div>
        </div>
        <p className="text-[#1E3A5F] font-medium text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          Yuklanmoqda...
        </p>
      </div>
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

// Table Loading Skeleton
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="h-6 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-6 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Button with loading state
export const LoadingButton = ({ loading, children, onClick, variant = "primary", className = "", ...props }) => {
  const baseClasses = "px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 justify-center";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#D4AF37] to-[#c49a2c] text-white hover:from-[#c49a2c] hover:to-[#D4AF37] shadow-lg shadow-[#D4AF37]/25",
    secondary: "bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] text-white hover:from-[#2d4a6f] hover:to-[#1E3A5F] shadow-lg shadow-[#1E3A5F]/20",
    outline: "border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      {...props}
    >
      {loading && <CircularProgress size={16} sx={{ color: 'currentColor' }} />}
      {children}
    </button>
  );
};

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        {Icon && <Icon sx={{ fontSize: 48, color: '#D4AF37' }} />}
      </div>
      <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {description}
      </p>
      {action}
    </div>
  );
};

export default {
  LoadingSpinner,
  FullPageLoading,
  CardSkeleton,
  TableSkeleton,
  LoadingButton,
  EmptyState
};

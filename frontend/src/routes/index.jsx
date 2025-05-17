// src/routes/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import OwnerRoutes from './OwnerRoutes';
import UserRoutes from './UserRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuth } from '../hooks/useAuth';

// Asosiy komponent: hamma routelarni birlashtirish
const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Yuklanmoqda...</div>;
  }

  return (
    <Routes>
      {/* Public routelar (login kabi) */}
      <Route>{PublicRoutes}</Route>

      {/* Admin routelari */}
      {user && user.role === 'admin' && <Route>{AdminRoutes}</Route>}

      {/* Owner routelari */}
      {user && user.role === 'owner' && <Route>{OwnerRoutes}</Route>}

      {/* User routelari */}
      {user && user.role === 'user' && <Route>{UserRoutes}</Route>}

      {/* Agar foydalanuvchi autentifikatsiyalangan bo‘lsa, lekin roliga mos rout yo‘q bo‘lsa */}
      {user && !['admin', 'owner', 'user'].includes(user.role) && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* Agar foydalanuvchi autentifikatsiyalanmagan bo‘lsa, login’ga yo‘naltirish */}
      {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
};

export default AppRoutes;
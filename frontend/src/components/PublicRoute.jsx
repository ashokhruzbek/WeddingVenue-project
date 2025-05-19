import React from 'react'
import { useAuth } from '../../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
    const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "owner") return <Navigate to="/owner" replace />;
    if (role === "user") return <Navigate to="/user" replace />;
  }

  return <Outlet />;
}

export default PublicRoute
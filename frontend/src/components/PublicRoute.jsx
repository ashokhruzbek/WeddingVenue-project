import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "owner") return <Navigate to="/owner" replace />;
    if (role === "user") return <Navigate to="/user" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

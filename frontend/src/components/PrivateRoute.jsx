import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isTeacherRoute = location.pathname.startsWith("/owner");
  const isStudentRoute = location.pathname.startsWith("/user");

  if (isAdminRoute && role !== "admin")
    return <Navigate to={`/${role}`} replace />;
  if (isTeacherRoute && role !== "owner")
    return <Navigate to={`/${role}`} replace />;
  if (isStudentRoute && role !== "user")
    return <Navigate to={`/${role}`} replace />;

  return <Outlet />;
};

export default PrivateRoute;

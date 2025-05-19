import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function PrivateRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
 if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOwnerRoute = location.pathname.startsWith("/owner");
  const isUserRoute = location.pathname.startsWith("/user");

  if (isAdminRoute && role !== "admin")
    return <Navigate to={`/${role}`} replace />;
  if (isOwnerRoute && role !== "owner")
    return <Navigate to={`/${role}`} replace />;
  if (isUserRoute && role !== "user")
    return <Navigate to={`/${role}`} replace />;

  return <Outlet />;
}

export default PrivateRoute;

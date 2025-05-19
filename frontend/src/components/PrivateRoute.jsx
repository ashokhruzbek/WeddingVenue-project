import React from "react";

function PrivateRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  return <div>PrivateRoute</div>;
}

export default PrivateRoute;

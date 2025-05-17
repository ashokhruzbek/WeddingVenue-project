/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const defaultRedirect = "/dashboard"; // Fallback redirect path

  // Ensure routes is an array, fallback to empty array if not
  const safeRoutes = Array.isArray(routes) ? routes : [];

  return (
    <Routes>
      {/* Public Route */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <Navigate
              to={safeRoutes[0]?.path || defaultRedirect}
              replace
            />
          }
        />
        {safeRoutes.map(({ path, layout: Layout, children }, index) => (
          <Route key={path || index} path={path} element={<Layout />}>
            {/* Ensure children is an array */}
            {Array.isArray(children) ? (
              children.map(({ path: childPath, element }, idx) => (
                <Route
                  key={idx}
                  index={childPath === ""}
                  path={childPath}
                  element={element}
                />
              ))
            ) : (
              // Optional: Render nothing or a fallback if children is invalid
              null
            )}
          </Route>
        ))}
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import MainLayout from "./layouts/MainLayout";
import routes from "./routes";
import Home from "./pages/home/Home";
import Venues from "./pages/user/Venues";
import VenueInfos from "./pages/user/VenueInfos";
import UserBookings from "./pages/user/UserBookings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/notFound/NotFound";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<Venues />} />
          <Route path="/user-venues/:id" element={<VenueInfos />} />
          <Route path="/user-bookings" element={<UserBookings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        {routes.map(({ path, layout: Layout, children }) => (
          <Route key={path} path={path} element={<Layout />}>
            {Array.isArray(children) &&
              children.map(({ path: childPath, element }, idx) => (
                <Route
                  key={idx}
                  index={childPath === "" || childPath === undefined}
                  path={childPath}
                  element={element}
                />
              ))}
          </Route>
        ))}
      </Route>
      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

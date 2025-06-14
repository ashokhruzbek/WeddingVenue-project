import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import MainLayout from "./layouts/MainLayout";
import routes from "./routes";
import Landing from "./pages/landing";
import Venues from "./pages/user/Venues";
import VenueInfos from "./pages/user/FavoritesVenues";
import UserBookings from "./pages/user/UserBookings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/notFound/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        {/* Umumiy (Public) yo‘llar */}
        <Route element={<PublicRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/venue" element={<Home />} />
            <Route path="/user-venues/:id" element={<VenueInfos />} />
            <Route path="/user-bookings" element={<UserBookings />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Maxsus (Private) yo‘llar */}
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

        {/* Noto‘g‘ri yo‘llar uchun */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;

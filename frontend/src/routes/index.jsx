import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import UserLayout from "../layouts/UserLayout";
import Admin from "../pages/admin";
import AllDistricts from "../pages/admin/AllDistricts";
import AllUsers from "../pages/admin/AllUsers";
import ApproveVenue from "../pages/admin/ApproveVenue";
import AssignOwner from "../pages/admin/AssignOwner";
import CreateOwner from "../pages/admin/CreateOwner";
import CreateVenue from "../pages/admin/CreateVenue";
import ManageBookings from "../pages/admin/ManageBookings";
import ViewAllVenues from "../pages/admin/ViewAllVenues";
import Owner from "../pages/owner";
import AddVenues from "../pages/owner/AddVenues";
import AllVenues from "../pages/owner/AllVenues";
import Bookings from "../pages/owner/Bookings";
import UpdateVenues from "../pages/owner/UpdateVenues";
import OwnerVenue from "../pages/owner/UpdateVenues";
import VenueBookings from "../pages/owner/VenueBookings";
import User from "../pages/user";
import FavoritesVenues from "../pages/user/FavoritesVenues";
import UserBookings from "../pages/user/UserBookings";
import Venues from "../pages/user/Venues";

export const routes = [
  {
    path: "/admin",
    layout: AdminLayout,
    children: [
      { path: "", element: <Admin /> },
      { path: "create-venue", element: <CreateVenue /> }, //Yangi to‘yxona qo'shish
      { path: "create-owner", element: <CreateOwner /> }, //Toyxona Egasini qo‘shish
      { path: "user", element: <AllUsers /> }, // Barcha Foydalanuvchilar
      { path: "venues", element: <ViewAllVenues /> }, //Barcha To‘yxonalar
      { path: "assign-owner", element: <AssignOwner /> }, //Toyxonaga Egasini biriktirish
      { path: "approve-venue", element: <ApproveVenue /> }, //To‘yxona tasdiqlash
      { path: "bookings", element: <ManageBookings /> }, // Buyurtmalarni boshqarish
      { path: "districts", element: <AllDistricts /> }, //Barcha Tumanlar
    ],
  },
  {
    path: "/user",
    layout: UserLayout,
    children: [
      { path: "", element: <User /> },
      { path: "venues", element: <Venues /> }, //To‘yxonalar
      { path: "favorites", element: <FavoritesVenues /> }, //Sevimlilar
      { path: "bookings", element: <UserBookings /> }, //Buyurtmalarim
    ],
  },
  {
    path: "/owner",
    layout: OwnerLayout,
    children: [
      { path: "", element: <Owner /> },
      { path: "venues", element: <AllVenues /> }, //Barcha to‘yxonalar
      { path: "reg-owner", element: <AddVenues /> }, //Yangi to‘yxona
      { path: "update-venue", element: <UpdateVenues /> }, //To‘yxona yangilash
      { path: "bookings", element: <Bookings /> }, //Barcha buyurtmalar
      { path: "venue-bookings", element: <VenueBookings /> }, //To‘yxona buyurtmalari
      { path: "districts", element: <AllDistricts /> }, //Tumanlar
    ],
  },
];
export default routes;

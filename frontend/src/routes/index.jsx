import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import Admin from "../pages/admin";
import CreateOwner from "../pages/admin/CreateOwner";
import CreateVenue from "../pages/admin/CreateVenue";
import Venues from "../pages/user/Venues";

export const routes = [
  {
    path: "/admin",
    layout: AdminLayout,
    children: [
      { path: "", element: <Admin /> },
      { path: "create-venue", element: <CreateVenue /> },
      { path: "create-owner", element: <CreateOwner /> },
    ],
  },
  {
    path: "/users",
    layout: UserLayout,
    children: [
      { path: "", element: <Venues /> },
    ],
  },
  {
    path: "/owner",
  }
];
export default routes;

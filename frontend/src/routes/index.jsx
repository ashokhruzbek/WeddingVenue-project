import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import UserLayout from "../layouts/UserLayout";
import Admin from "../pages/admin";
import CreateOwner from "../pages/admin/CreateOwner";
import CreateVenue from "../pages/admin/CreateVenue";
import OwnerVenue from "../pages/owner/OwnerVenue";
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
    path: "/user",
    layout: UserLayout,
    children: [
      { path: "", element: <Venues /> },
    ],
  },
  {
    path: "/owner",
    layout: OwnerLayout,
    children: [
      { path: "", element: <OwnerVenue/> }
    ]
  }
];
export default routes;

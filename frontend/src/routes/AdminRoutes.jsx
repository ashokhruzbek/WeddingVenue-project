import AdminLayout from "../layouts/AdminLayout";
import AddUser from "../pages/admin/AddUser";
import Dashboard from "../pages/admin/Dashboard";
import Owners from "../pages/admin/Owners";
import Users from "../pages/admin/Users";

const AdminRoute = [
  {
    path: "/admin",
    layout: AdminLayout,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "add-venue", element: <StudentTable /> },
      { path: "all-user", element: <Users /> },
      { path: "all-owners", element: <Owners /> },
      { path: "add-owner", element: <AddUser/> },
    ],
  },
];
export default AdminRoute
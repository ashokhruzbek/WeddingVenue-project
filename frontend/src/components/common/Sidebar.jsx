import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Role-based menu items
  const menus = {
    admin: [
      { path: '/admin/dashboard', label: 'Boshqaruv Paneli', icon: '🏠' },
      { path: '/admin/venues', label: 'To‘yxonalar', icon: '🏛️' },
      { path: '/admin/owners', label: 'Egalari', icon: '👤' },
      { path: '/admin/bookings', label: 'Bronlar', icon: '📅' },
      { path: '/admin/add-venue', label: 'Yangi To‘yxona', icon: '➕' },
      { path: '/admin/add-user', label: 'Yangi Egani', icon: '➕' },
    ],
    owner: [
      { path: '/owner/dashboard', label: 'Boshqaruv Paneli', icon: '🏠' },
      { path: '/owner/register-venue', label: 'To‘yxona Ro‘yxati', icon: '🏛️' },
      { path: '/owner/edit-venue', label: 'To‘yxona Tahrirlash', icon: '✏️' },
      { path: '/owner/bookings', label: 'Bronlar', icon: '📅' },
    ],
    user: [
      { path: '/user/home', label: 'Bosh Sahifa', icon: '🏠' },
      { path: '/user/venues', label: 'To‘yxonalar', icon: '🏛️' },
      { path: '/user/my-bookings', label: 'Mening Bronlarim', icon: '📅' },
    ],
  };

  // Get menu based on user role
  const menuItems = user?.role ? menus[user.role] : [];

  return (
    <div className="w-64 bg-white shadow h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center">Menyu</h2>
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-500 hover:bg-blue-100'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      {user && (
        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center p-2 text-red-500 hover:bg-red-100 rounded-lg"
          >
            <span className="mr-2">🚪</span>
            <span>Chiqish</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
// src/pages/admin/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import { API } from '../../utils/endpoints';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalVenues: 0,
    pendingVenues: 0,
    totalBookings: 0,
    totalOwners: 0,
  });
  const [recentVenues, setRecentVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch venues
      const venuesResponse = await axios.get(API.ADMIN.VIEW_VENUES);
      const venues = venuesResponse.data || [];
      const pending = venues.filter((venue) => venue.status === 'tasdiqlanmagan').length;

      // Fetch bookings
      const bookingsResponse = await axios.get(API.ADMIN.VIEW_BOOKINGS);
      const bookings = bookingsResponse.data || [];

      // Fetch owners
      const ownersResponse = await axios.get(API.ADMIN.VIEW_OWNERS);
      const owners = ownersResponse.data || [];

      setStats({
        totalVenues: venues.length,
        pendingVenues: pending,
        totalBookings: bookings.length,
        totalOwners: owners.length,
      });

      setRecentVenues(venues.slice(0, 5));
    } catch (error) {
      toast.error('Ma’lumotlarni yuklashda xatolik yuz berdi');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Bo‘sh dependency array, chunki fetchData tashqi o‘zgaruvchilarga bog‘liq emas

  useEffect(() => {
    // Prevent navigation if already on /login
    if (location.pathname === '/login') {
      return;
    }

    // Wait for auth to resolve
    if (authLoading) {
      return;
    }

    if (user && user.role === 'admin') {
      fetchData();
    } else if (user === null) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate, location.pathname, fetchData]);

  // Table columns
  const venueColumns = [
    { header: 'Nomi', accessor: 'name' },
    { header: 'Rayon', accessor: 'district' },
    { header: 'Sig‘im', accessor: 'capacity' },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            status === 'tasdiqlanmagan' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
          }`}
        >
          {status === 'tasdiqlanmagan' ? 'Tasdiqlanmagan' : 'Tasdiqlangan'}
        </span>
      ),
    },
    {
      header: 'Amallar',
      accessor: '_id',
      render: (id) => (
        <Button
          text="Ko‘rish"
          onClick={() => navigate(`/admin/venues/${id}`)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        />
      ),
    },
  ];

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Auth loading holatida loader ko‘rsatish
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center">Yuklanmoqda...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Boshqaruv Paneli</h1>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center text-gray-600">Yuklanmoqda...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-700">Jami To‘yxonalar</h3>
                <p className="text-2xl text-blue-600">{stats.totalVenues}</p>
                <Button
                  text="Barchasini ko‘rish"
                  onClick={() => handleNavigate('/admin/venues')}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-700">Tasdiqlanmagan To‘yxonalar</h3>
                <p className="text-2xl text-yellow-600">{stats.pendingVenues}</p>
                <Button
                  text="Tasdiqlash"
                  onClick={() => handleNavigate('/admin/venues?status=tasdiqlanmagan')}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-700">Jami Bronlar</h3>
                <p className="text-2xl text-green-600">{stats.totalBookings}</p>
                <Button
                  text="Barchasini ko‘rish"
                  onClick={() => handleNavigate('/admin/bookings')}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-700">Jami Egalari</h3>
                <p className="text-2xl text-purple-600">{stats.totalOwners}</p>
                <Button
                  text="Barchasini ko‘rish"
                  onClick={() => handleNavigate('/admin/owners')}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                />
              </div>
            </div>
          )}

          {/* Recent Venues Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">So‘nggi To‘yxonalar</h2>
            {recentVenues.length === 0 && !loading ? (
              <p className="text-center text-gray-500">Hozircha to‘yxonalar yo‘q</p>
            ) : (
              <Table columns={venueColumns} data={recentVenues} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex space-x-4">
            <Button
              text="Yangi To‘yxona Qo‘shish"
              onClick={() => handleNavigate('/admin/add-venue')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            />
            <Button
              text="Yangi Egani Qo‘shish"
              onClick={() => handleNavigate('/admin/add-user')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
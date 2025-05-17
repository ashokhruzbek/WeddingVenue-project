// src/pages/user/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { API } from '../../utils/endpoints';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalVenues: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user-specific data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user's bookings
        const bookingsResponse = await axios.get(API.USER.GET_BOOKINGS);
        const bookings = bookingsResponse.data || [];
        const upcoming = bookings.filter((booking) => booking.status === 'endi bo‘ladigan').length;

        // Fetch available venues
        const venuesResponse = await axios.get(API.USER.GET_VENUES);
        const venues = venuesResponse.data || [];

        setStats({
          totalBookings: bookings.length,
          upcomingBookings: upcoming,
          totalVenues: venues.length,
        });

        // Get 5 most recent bookings
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        toast.error('Ma’lumotlarni yuklashda xatolik yuz berdi');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'user') {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  // Table columns for recent bookings
  const bookingColumns = [
    { header: 'Bron ID', accessor: 'id' },
    { header: 'To‘yxona', accessor: 'venueName' },
    { header: 'Sana', accessor: 'date' },
    { header: 'Odamlar soni', accessor: 'peopleCount' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Amallar',
      accessor: 'id',
      render: (id) => (
        <Button
          text="Bekor qilish"
          onClick={() => handleCancelBooking(id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        />
      ),
    },
  ];

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(API.USER.CANCEL_BOOKING(bookingId));
      toast.success('Bron muvaffaqiyatli bekor qilindi');
      setRecentBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      toast.error('Bronni bekor qilishda xatolik');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">Foydalanuvchi Bosh Sahifasi</h1>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center">Yuklanmoqda...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Mavjud To‘yxonalar</h3>
                <p className="text-2xl">{stats.totalVenues}</p>
                <Button
                  text="Barchasini ko‘rish"
                  onClick={() => navigate('/user/venues')}
                  className="mt-2 text-blue-500"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Mening Bronlarim</h3>
                <p className="text-2xl">{stats.totalBookings}</p>
                <Button
                  text="Barchasini ko‘rish"
                  onClick={() => navigate('/user/my-bookings')}
                  className="mt-2 text-blue-500"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Kutilayotgan Bronlar</h3>
                <p className="text-2xl">{stats.upcomingBookings}</p>
                <Button
                  text="Ko‘rish"
                  onClick={() => navigate('/user/my-bookings?status=endi bo‘ladigan')}
                  className="mt-2 text-blue-500"
                />
              </div>
            </div>
          )}

          {/* Recent Bookings Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">So‘nggi Bronlar</h2>
            <Table columns={bookingColumns} data={recentBookings} />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex space-x-4">
            <Button
              text="Yangi Bron Qilish"
              onClick={() => navigate('/user/venues')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
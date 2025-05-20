import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Barcha buyurtmalarni olish
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const response = await axios.get("http://localhost:4000/admin/view-all-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.response?.data?.error || "Buyurtmalarni yuklashda xatolik yuz berdi");
      toast.error(error.response?.data?.error || "Buyurtmalarni yuklashda xatolik yuz berdi", {
        duration: 3000,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Buyurtmani bekor qilish
  const handleCancelBooking = async (id) => {
    if (!id || isNaN(Number(id))) {
      setError("Noto‘g‘ri buyurtma ID si");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const response = await axios.delete(
        `http://localhost:4000/admin/cancel-booking/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Buyurtma muvaffaqiyatli bekor qilindi", {
        duration: 3000,
      });
      // Buyurtmalar ro‘yxatini yangilash
      await fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Buyurtmani bekor qilishda xatolik yuz berdi";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 3000,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Komponent yuklanganda buyurtmalarni olish
  useEffect(() => {
    fetchBookings();
  }, [navigate]);

  return (
    <Box p={{ xs: 2, sm: 3 }} maxWidth="1200px" mx="auto">
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
        📋 Barcha buyurtmalarni boshqarish
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && bookings.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>To‘yxona nomi</TableCell>
              <TableCell>Foydalanuvchi</TableCell>
              <TableCell>Sana</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.venue_name || "Noma'lum"}</TableCell>
                <TableCell>{booking.user_name || "Noma'lum"}</TableCell>
                <TableCell>{booking.date || "Noma'lum"}</TableCell>
                <TableCell>{booking.status || "Noma'lum"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={loading}
                    size="small"
                  >
                    {loading ? <CircularProgress size={20} /> : "Bekor qilish"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default ManageBookings;
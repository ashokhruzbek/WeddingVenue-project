import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ApproveVenue = () => {
  const [venues, setVenues] = useState([]); // To‘yxonalar ro‘yxati
  const [selectedVenueId, setSelectedVenueId] = useState(""); // string sifatida ishlatamiz
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Barcha to‘yxonalarni olish
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const response = await axios.get("http://localhost:4000/admin/venues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data.venues) ? response.data.venues : [];

      const formattedData = data.map((venue) => ({
        ...venue,
        id: String(venue.id),
      }));

      setVenues(formattedData);
    } catch (error) {
      console.error("To‘yxonalarni olishda xatolik:", error);
      setError("To‘yxonalarni olishda xatolik yuz berdi");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Komponent yuklanganda to‘yxonalarni olish
  useEffect(() => {
    fetchVenues();
  }, []); // faqat bir marta chaqiriladi

  // Statusni o‘zbek tilida ko‘rsatish
  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "Tasdiqlanmagan";
      case "approved":
        return "Tasdiqlangan";
      case "rejected":
        return "Rad etilgan";
      default:
        return "Noma'lum";
    }
  };

  // Tasdiqlash yoki rad etish funksiyasi
  const handleAction = async (action) => {
    if (!selectedVenueId) {
      setError("Iltimos, to‘yxona tanlang");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const endpoint = action === "approve" ? "approve-venue" : "reject-venue";

      const response = await axios.put(
        `http://localhost:4000/admin/${endpoint}/${selectedVenueId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        response.data.message ||
          (action === "approve"
            ? "To‘yxona muvaffaqiyatli tasdiqlandi"
            : "To‘yxona muvaffaqiyatli rad etildi"),
        { duration: 3000 }
      );

      // To‘yxonalar ro‘yxatini yangilash va tanlovni tozalash
      await fetchVenues();
      setSelectedVenueId("");
    } catch (error) {
      console.error(
        `Error ${action === "approve" ? "approving" : "rejecting"} venue:`,
        error
      );
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        `${action === "approve" ? "Tasdiqlashda" : "Rad etishda"} xatolik yuz berdi`;
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tanlangan to‘yxonaning statusini aniqlash
  const selectedVenue =
    venues && Array.isArray(venues)
      ? venues.find((venue) => venue.id === selectedVenueId)
      : null;
  const isApproved = selectedVenue?.status === "approved";

  return (
    <Box p={{ xs: 2, sm: 3 }} maxWidth="600px" mx="auto">
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}
      >
        ✅ To‘yxonani tasdiqlash yoki rad etish
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && venues.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          <FormControl
            variant="outlined"
            fullWidth
            disabled={loading || venues.length === 0}
          >
            <InputLabel>To‘yxona tanlang</InputLabel>
            <Select
              label="To‘yxona tanlang"
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              disabled={loading || venues.length === 0}
            >
              <MenuItem value="">To‘yxona tanlang</MenuItem>
              {venues.map((venue) => (
                <MenuItem key={venue.id} value={venue.id}>
                  {venue.name} ({formatStatus(venue.status)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAction("approve")}
              disabled={loading || !selectedVenueId || isApproved || venues.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => handleAction("reject")}
              // Rad etish tugmasi har doim tanlangan bo‘lsa faollashadi
              disabled={loading || !selectedVenueId || venues.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Rad etilmoqda..." : "Rad etish"}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default ApproveVenue;

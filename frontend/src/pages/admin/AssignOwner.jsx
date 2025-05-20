import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AssignOwner = () => {
  const [formData, setFormData] = useState({
    venue_name: "",
    owner_name: "",
    venue_id: "",
    owner_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Nomdan ID olish funktsiyasi
  const fetchIdFromName = async (type, name) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      const endpoint =
        type === "venue" ? "/admin/venues/search" : "/admin/owners/search";

      const response = await axios.get(
        `http://localhost:4000${endpoint}?query=${encodeURIComponent(name)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const idKey = type === "venue" ? "venue_id" : "owner_id";
      return response.data[idKey] || null;
    } catch (error) {
      console.error(`Error fetching ${type} ID:`, error);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateId = (id) => {
    const numId = Number(id);
    return !isNaN(numId) && numId > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // venue_name va owner_name bo'sh emasligini tekshirish
    if (!formData.venue_name.trim()) {
      setError("To‘yxona nomi kiritilishi shart");
      setLoading(false);
      return;
    }
    if (!formData.owner_name.trim()) {
      setError("Egasi nomi kiritilishi shart");
      setLoading(false);
      return;
    }

    // venue_id va owner_id ni olish
    const venueId = await fetchIdFromName("venue", formData.venue_name);
    const ownerId = await fetchIdFromName("owner", formData.owner_name);

    if (!validateId(venueId)) {
      setError("To‘yxona ID si topilmadi yoki noto‘g‘ri");
      setLoading(false);
      return;
    }
    if (!validateId(ownerId)) {
      setError("Egasi ID si topilmadi yoki noto‘g‘ri");
      setLoading(false);
      return;
    }

    // API uchun ma'lumotlar
    const payload = {
      venue_id: Number(venueId),
      owner_id: Number(ownerId),
    };
    console.log("API ga yuborilayotgan ma'lumotlar:", payload);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

      const response = await axios.post(
        "http://localhost:4000/admin/assign-owner",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        response.data.message || "To‘yxona egasi muvaffaqiyatli biriktirildi",
        {
          duration: 3000,
        }
      );

      setFormData({
        venue_name: "",
        owner_name: "",
        venue_id: "",
        owner_id: "",
      });

      navigate("/admin/venues");
    } catch (error) {
      console.error("Error assigning owner:", error);
      const errorMessage =
        error.response?.data?.message || "Egani biriktirishda xatolik yuz berdi";
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

  return (
    <Box p={{ xs: 2, sm: 3 }} maxWidth="600px" mx="auto">
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}
      >
        🔗 To‘yxonaga egasi biriktirish
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="To‘yxona nomi"
            name="venue_name"
            value={formData.venue_name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            helperText={"To‘yxona nomini kiriting"}
            error={!!error && !formData.venue_name.trim()}
          />

          <TextField
            label="Egasi nomi"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            helperText={"Egasi nomini kiriting"}
            error={!!error && !formData.owner_name.trim()}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Biriktirmoqda..." : "Biriktirish"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AssignOwner;

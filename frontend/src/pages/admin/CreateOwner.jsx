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

const CreateOwner = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone_number: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+998\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validatsiya
    if (!formData.firstname.trim()) {
      setError("Ismni kiriting");
      setLoading(false);
      return;
    }
    if (!formData.lastname.trim()) {
      setError("Familiyani kiriting");
      setLoading(false);
      return;
    }
    if (!validatePhoneNumber(formData.phone_number)) {
      setError("Telefon raqami +998 bilan boshlanib, 12 raqamdan iborat bo‘lishi kerak");
      setLoading(false);
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Email noto‘g‘ri formatda");
      setLoading(false);
      return;
    }

    // Yuboriladigan ma'lumot
    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.phone_number, // telefon raqamni username qilamiz
      password: "owner123", // vaqtincha parol yoki generate qilingan parol
      email: formData.email || undefined,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token topilmadi");

      const response = await axios.post(
        "http://localhost:4000/admin/create-owner",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Egasi yaratildi", {
        duration: 3000,
      });

      setFormData({
        firstname: "",
        lastname: "",
        phone_number: "",
        email: "",
      });

      navigate("/admin/owners");
    } catch (error) {
      console.error("Owner yaratishda xatolik:", error);
      const errorMessage = error.response?.data?.message || "Xatolik yuz berdi";
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

  return (
    <Box p={3} maxWidth="600px" mx="auto">
      <Typography variant="h5" gutterBottom fontWeight="bold">
        👤 Yangi egasi yaratish
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Ism"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Familiya"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Telefon raqami"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            placeholder="+998901234567"
            disabled={loading}
          />

          <TextField
            label="Email (ixtiyoriy)"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            placeholder="example@domain.com"
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateOwner;

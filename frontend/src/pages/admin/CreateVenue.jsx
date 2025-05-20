import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
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
import { toast } from "react-toastify";

// Toshkent shahridagi tumanlar ro‘yxati
const tashkentDistricts = [
  { id: "1", name: "Bektemir" },
  { id: "2", name: "Chilanzar" },
  { id: "3", name: "Mirzo Ulug‘bek" },
  { id: "4", name: "Olmazor" },
  { id: "5", name: "Sergeli" },
  { id: "6", name: "Shayxontohur" },
  { id: "7", name: "Uchtepa" },
  { id: "8", name: "Yashnobod" },
  { id: "9", name: "Yakkasaroy" },
  { id: "10", name: "Yangihayot" },
  { id: "11", name: "Mirobod" },
  { id: "12", name: "Yunusobod" },
];

const CreateVenue = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    capacity: "",
    price_seat: "",
    district_id: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Formani boshqarish
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Telefon raqamini validatsiya qilish (+998 bilan boshlanishi, 12 raqam)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+998\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Formani yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validatsiya
    if (!formData.name) {
      setError("To‘yxona nomini kiriting");
      setLoading(false);
      return;
    }
    if (!validatePhoneNumber(formData.phone_number)) {
      setError("Telefon raqami +998 bilan boshlanib, 12 raqamdan iborat bo‘lishi kerak (masalan, +998901234567)");
      setLoading(false);
      return;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError("O‘rindiqlar soni ijobiy bo‘lishi kerak");
      setLoading(false);
      return;
    }
    if (!formData.price_seat || formData.price_seat <= 0) {
      setError("Narx ijobiy bo‘lishi kerak");
      setLoading(false);
      return;
    }
    if (!formData.district_id) {
      setError("Tuman tanlang");
      setLoading(false);
      return;
    }
    if (!formData.address) {
      setError("Manzil kiriting");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const response = await axios.post(
        "http://localhost:4000/admin/create-venue",
        {
          name: formData.name,
          phone_number: formData.phone_number,
          capacity: Number(formData.capacity),
          price_seat: Number(formData.price_seat),
          district_id: formData.district_id,
          address: formData.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "To‘yxona muvaffaqiyatli yaratildi", {
        duration: 3000,
      });
      // Formani tozalash
      setFormData({
        name: "",
        phone_number: "",
        capacity: "",
        price_seat: "",
        district_id: "",
        address: "",
      });
      // Sahifani yangilash yoki boshqa sahifaga o'tish
      navigate("/admin/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
      setError(error.response?.data?.error || "To‘yxona yaratishda xatolik yuz berdi");
      toast.error(error.response?.data?.error || "To‘yxona yaratishda xatolik yuz berdi", {
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
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
        🏟️ Yangi to‘yxona yaratish
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
            name="name"
            value={formData.name}
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
            helperText="Masalan, +998901234567"
          />

          <TextField
            label="O‘rindiqlar soni"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Narxi (so‘m)"
            name="price_seat"
            type="number"
            value={formData.price_seat}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            inputProps={{ min: 1 }}
          />

          <FormControl variant="outlined" fullWidth disabled={loading}>
            <InputLabel>Tuman</InputLabel>
            <Select
              label="Tuman"
              name="district_id"
              value={formData.district_id}
              onChange={handleChange}
            >
              <MenuItem value="">Tuman tanlang</MenuItem>
              {tashkentDistricts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Manzil"
            name="address"
            value={formData.address}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            multiline
            rows={2}
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

export default CreateVenue;
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
    username: "", // changed from phone_number to username
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateUsername = (username) => {
    return username.trim().length > 0; // Basic check for username
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

    // Validation
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
    if (!validateUsername(formData.username)) {
      setError("Username kiritilishi kerak");
      setLoading(false);
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Email noto‘g‘ri formatda");
      setLoading(false);
      return;
    }

    // Payload
    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.username, // using username now
      password: "owner123", // Replace with a secure method or random generation
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
        username: "", // reset username as well
        email: "",
      });

      navigate("/admin/user");
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
    <Box
      p={{ xs: 2, sm: 3 }}
      maxWidth="600px"
      mx="auto"
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        color: "#333333",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#ff4d94",
        }}
      >
        👤 Yangi egasi yaratish
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #ff4d94",
            borderRadius: "8px",
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Ism"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{
              "& .MuiInputLabel-root": { color: "#ff4d94" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff4d94" },
                "&:hover fieldset": { borderColor: "#ff4d94" },
                "&.Mui-focused fieldset": { borderColor: "#ff4d94" },
              },
            }}
          />

          <TextField
            label="Familiya"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{
              "& .MuiInputLabel-root": { color: "#ff4d94" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff4d94" },
                "&:hover fieldset": { borderColor: "#ff4d94" },
                "&.Mui-focused fieldset": { borderColor: "#ff4d94" },
              },
            }}
          />

          <TextField
            label="Username"
            name="username" // updated to username
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{
              "& .MuiInputLabel-root": { color: "#ff4d94" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff4d94" },
                "&:hover fieldset": { borderColor: "#ff4d94" },
                "&.Mui-focused fieldset": { borderColor: "#ff4d94" },
              },
            }}
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
            sx={{
              "& .MuiInputLabel-root": { color: "#ff4d94" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff4d94" },
                "&:hover fieldset": { borderColor: "#ff4d94" },
                "&.Mui-focused fieldset": { borderColor: "#ff4d94" },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#ff4d94",
              "&:hover": { backgroundColor: "#ff1a75" },
              color: "#ffffff",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "8px",
              textTransform: "none",
            }}
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

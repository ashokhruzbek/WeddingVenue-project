import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AssignOwner = () => {
  const [formData, setFormData] = useState({
    venue_name: "",
    owner_name: "",
  });
  const [venues, setVenues] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Autentifikatsiya tokeni topilmadi");

        const [venuesRes, ownersRes] = await Promise.all([
          axios.get("/api/admin/venues", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/owners", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVenues(venuesRes.data.venues || []);
        setOwners(ownersRes.data.owners || []);
      } catch (err) {
        console.error("Ma'lumotlarni olishda xatolik:", err);
        setError("Ma'lumotlarni olishda xatolik yuz berdi");
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.venue_name || !formData.owner_name) {
      setError("Iltimos, to‘liq ma'lumotlarni tanlang");
      setLoading(false);
      return;
    }

    const selectedVenue = venues.find((v) => v.name === formData.venue_name);
    const selectedOwner = owners.find(
      (o) => o.username === formData.owner_name
    );

    if (!selectedVenue || !selectedOwner) {
      setError("Tanlangan qiymatlar topilmadi");
      setLoading(false);
      return;
    }

    const payload = {
      venue_id: selectedVenue.id,
      owner_id: selectedOwner.id,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token mavjud emas");

      const res = await axios.post("/api/admin/assign-owner", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Egasi muvaffaqiyatli biriktirildi");
      setFormData({ venue_name: "", owner_name: "" });
      navigate("/admin/venues");
    } catch (err) {
      console.error("Xatolik:", err);
      const msg =
        err.response?.data?.message || "Egani biriktirishda xatolik yuz berdi";
      setError(msg);
      toast.error(msg);
      if (err.response?.status === 401) {
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
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        color: "#333",
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
        🔗 To‘yxonaga egasi biriktirish
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
          <Autocomplete
            options={venues.map((v) => v.name)}
            value={formData.venue_name}
            onChange={(e, newValue) =>
              handleChange("venue_name", newValue || "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="To‘yxona nomi"
                fullWidth
                disabled={loading}
                helperText="To‘yxona nomini tanlang"
                sx={{
                  "& .MuiInputLabel-root": { color: "#ff4d94" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ff4d94" },
                    "&:hover fieldset": { borderColor: "#ff4d94" },
                    "&.Mui-focused fieldset": { borderColor: "#ff4d94" },
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={owners.map((o) => o.username)}
            value={formData.owner_name}
            onChange={(e, newValue) =>
              handleChange("owner_name", newValue || "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Egasi nomi"
                fullWidth
                disabled={loading}
                helperText="Egasi nomini tanlang"
                sx={{
                  "& .MuiInputLabel-root": { color: "#ff4d94" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ff4d94" },
                    "&:hover fieldset": { borderColor: "#ff4d94" },
                    "&.Mui-focused fieldset": { borderColor: "#ff4d94" },
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#ff4d94",
              "&:hover": { backgroundColor: "#ff1a75" },
              color: "#fff",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            {loading ? "Biriktirmoqda..." : "Biriktirish"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AssignOwner;

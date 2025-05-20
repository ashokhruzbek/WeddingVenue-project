import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewAllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // Tartiblash maydoni
  const [sortOrder, setSortOrder] = useState("asc"); // Tartiblash tartibi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API dan ma'lumotlarni olish
  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      // API so'roviga parametrlar qo'shamiz
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.order = sortOrder;

      const response = await axios.get("http://localhost:4000/admin/venues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setVenues(response.data.venues || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Ma'lumotlarni olishda xatolik"
      );
      toast.error(
        error.response?.data?.error ||
          "To‘yxonalarni olishda xatolik yuz berdi",
        {
          duration: 3000,
        }
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchTerm, sortBy, sortOrder, navigate]);

  // Komponent yuklanganda ma'lumotlarni olish
  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  // Status chipini render qilish
  const renderStatus = (status) => {
    let color;
    switch (status) {
      case "tasdiqlangan":
        color = "success";
        break;
      case "kutilmoqda":
        color = "warning";
        break;
      case "rad etilgan":
        color = "error";
        break;
      default:
        color = "default";
    }
    return (
      <Chip label={status} color={color} variant="outlined" size="small" />
    );
  };

  // Filtrlarni tozalash
  const clearFilters = () => {
    setFilterStatus("");
    setSearchTerm("");
    setSortBy("");
    setSortOrder("asc");
    toast.success("Filtrlar tozalandi", { duration: 2000 });
  };

  return (
    <Box p={{ xs: 2, sm: 3 }} maxWidth="1200px" mx="auto">
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        🏟️ Barcha to‘yxonalar
      </Typography>

      {/* Filter va qidirish paneli */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          label="Nom bo‘yicha qidirish"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          disabled={loading}
        />

        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="">Barchasi</MenuItem>
            <MenuItem value="tasdiqlangan">Tasdiqlangan</MenuItem>
            <MenuItem value="kutilmoqda">Kutilmoqda</MenuItem>
            <MenuItem value="tasdiqlanmagangan">Tasdiqlanmagangan</MenuItem>

            <MenuItem value="rad etilgan">Rad etilgan</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tartiblash</InputLabel>
          <Select
            label="Tartiblash"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="">Standart</MenuItem>
            <MenuItem value="price_seat">Narx bo‘yicha</MenuItem>
            <MenuItem value="capacity">Sig‘im bo‘yicha</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Tartib</InputLabel>
          <Select
            label="Tartib"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            disabled={loading || !sortBy}
          >
            <MenuItem value="asc">O‘sish</MenuItem>
            <MenuItem value="desc">Kamayish</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="secondary"
          onClick={clearFilters}
          disabled={loading}
        >
          Tozalash
        </Button>
      </Stack>

      {/* Xato xabari */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Yuklanish holati */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Ma'lumotlar jadvali */}
      {!loading && !error && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nomi</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Telefon</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>O‘rindiqlar</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Narxi (so‘m)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      To‘yxonalar topilmadi
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                venues.map((venue, index) => (
                  <TableRow
                    key={venue.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{venue.name}</TableCell>
                    <TableCell>{venue.phone_number}</TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                    <TableCell>
                      {Number(venue.price_seat).toLocaleString("uz-UZ")}
                    </TableCell>
                    <TableCell>{renderStatus(venue.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewAllVenues;

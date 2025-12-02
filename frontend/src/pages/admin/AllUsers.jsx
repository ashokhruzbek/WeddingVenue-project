import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TableContainer,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all owners
  const fetchOwners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autentifikatsiya tokeni topilmadi");
      }

      const response = await axios.get("/api/admin/owners", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data.owners)
        ? response.data.owners
        : [];
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      setError(
        error.response?.data?.error || "Egalarni yuklashda xatolik yuz berdi"
      );
      toast.error(
        error.response?.data?.error || "Egalarni yuklashda xatolik yuz berdi",
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
  };

  useEffect(() => {
    fetchOwners();
  }, [navigate]);

  return (
    <Box p={{ xs: 2, sm: 4 }} maxWidth="1200px" mx="auto">
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        👥 Barcha egalarni ko‘rish
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && owners.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>To‘liq ism</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Telefon / Username
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map((owner) => (
                <TableRow
                  key={owner.id}
                  hover
                  sx={{
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <TableCell>{owner.id}</TableCell>
                  <TableCell>
                    {(owner.firstname || "") + " " + (owner.lastname || "") ||
                      "Noma'lum"}
                  </TableCell>
                  <TableCell>{owner.username || "Noma'lum"}</TableCell>
                  <TableCell>🇺🇿 {owner.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AllOwners;

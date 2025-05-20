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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

      const response = await axios.get("http://localhost:4000/admin/owners", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // API javobidan owners massivini olish
      const data = Array.isArray(response.data.owners) ? response.data.owners : [];
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      setError(error.response?.data?.error || "Egalarni yuklashda xatolik yuz berdi");
      toast.error(error.response?.data?.error || "Egalarni yuklashda xatolik yuz berdi", {
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

  // Fetch owners on component mount
  useEffect(() => {
    fetchOwners();
  }, [navigate]);

  return (
    <Box p={{ xs: 2, sm: 3 }} maxWidth="1200px" mx="auto">
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}
      >
        👥 Barcha egalarni ko‘rish
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && owners.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>To‘liq ism</TableCell>
              <TableCell>Telefon / Username</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>{owner.id}</TableCell>
                <TableCell>
                  {(owner.firstname || "") + " " + (owner.lastname || "") || "Noma'lum"}
                </TableCell>
                <TableCell>{owner.username || "Noma'lum"}</TableCell>
                <TableCell>{"-"}{/* Email API javobida yo‘q */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default AllOwners;

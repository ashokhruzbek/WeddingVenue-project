import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function AddVenues() {
  const [formData, setFormData] = useState({
    name: "",
    district_id: "",
    address: "",
    capacity: "",
    price_seat: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  // Input o‘zgarishini ushlash
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Oddiy validatsiya
    if (
      !formData.name ||
      !formData.district_id ||
      !formData.address ||
      !formData.capacity ||
      !formData.price_seat ||
      !formData.phone_number
    ) {
      toast.error("Iltimos, barcha maydonlarni to‘ldiring");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/owner/reg-owner",
        {
          name: formData.name,
          district_id: Number(formData.district_id),
          address: formData.address,
          capacity: Number(formData.capacity),
          price_seat: Number(formData.price_seat),
          phone_number: formData.phone_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "To'yxona muvaffaqiyatli qo‘shildi");
      setFormData({
        name: "",
        district_id: "",
        address: "",
        capacity: "",
        price_seat: "",
        phone_number: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Yangi To'yxona Qo'shish</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="To'yxona nomi"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <input
          type="number"
          name="district_id"
          placeholder="Tuman ID (raqam)"
          value={formData.district_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <input
          type="text"
          name="address"
          placeholder="Manzil"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <input
          type="number"
          name="capacity"
          placeholder="Sig'im (son)"
          value={formData.capacity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <input
          type="number"
          name="price_seat"
          placeholder="Narx (so'm)"
          value={formData.price_seat}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Telefon raqam (+998...)"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
        >
          {loading ? "Yuklanmoqda..." : "Qo'shish"}
        </button>
      </form>
    </div>
  );
}

export default AddVenues;

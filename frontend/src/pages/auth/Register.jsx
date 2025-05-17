import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
 import axiosInstance from "../../utils/axios";
import { API } from "../../utils/endpoints";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const response = await  axiosInstance.post(API.SIGNUP,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setIsLoading(false);

      // Token va foydalanuvchi ma'lumotini localStorage ga saqlash
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Ro'yxatdan o'tgandan keyin kerakli sahifaga yo'naltirish
      navigate(`/${response.data.user.role || "dashboard"}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Register error:", error);
      if (error.response) {
        setError(error.response.data.message || "Registration failed");
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Server error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="p-[100px]">
      <div className="max-w-xs bg-white rounded-3xl p-6 border-4 border-white shadow-lg mx-auto">
        <h2 className="text-center font-extrabold text-2xl text-blue-500">
          Sign Up
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mt-3 text-sm">
            {error}
          </div>
        )}

        <form className="mt-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="w-full bg-white border-none p-4 rounded-xl mt-3 shadow-md focus:border-blue-400 focus:outline-none"
            onChange={handleChange}
            value={formData.username}
            required
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="w-full bg-white border-none p-4 rounded-xl mt-3 shadow-md focus:border-blue-400 focus:outline-none"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="w-full bg-white border-none p-4 rounded-xl mt-3 shadow-md focus:border-blue-400 focus:outline-none"
            onChange={handleChange}
            value={formData.password}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            className="w-full font-bold bg-gradient-to-r from-blue-500 to-blue-400 text-white py-4 mt-5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

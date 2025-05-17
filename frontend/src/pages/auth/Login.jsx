// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../utils/axios';
import { API } from '../../utils/endpoints';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const Login = () => {
  const { user, login, isLoading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const role = user.role;
      if (!role) {
        setError('Foydalanuvchi roli aniqlanmadi');
        return;
      }
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(API.LOGIN, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { token, user: userData } = response.data;
      if (!token || !userData) {
        throw new Error('Token yoki foydalanuvchi ma’lumotlari topilmadi');
      }

      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      console.log('User data from response:', userData);

      // Ensure role is set in userData
      const role = userData.role || decoded.role || decoded.roles || decoded.userRole;
      if (!role) {
        throw new Error('Rol aniqlanmadi');
      }
      userData.role = role; // Ensure userData has the role

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      await login({ ...formData, userData }); // Pass userData to login function
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Kirishda xatolik yuz berdi';
      if (error.response) {
        errorMessage = error.response.data.message || 'Foydalanuvchi nomi yoki parol xato';
      } else if (error.request) {
        errorMessage = 'Server bilan bog‘lanishda xatolik. Iltimos, qayta urinib ko‘ring.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-[100px]">
      <div className="max-w-xs w-full bg-white rounded-3xl p-6 border-4 border-white shadow-lg mx-auto">
        <h2 className="text-center font-extrabold text-2xl text-blue-500">Kirish</h2>

        {(error || authError) && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mt-3 text-sm text-center">
            {error || authError}
          </div>
        )}

        <form className="mt-5" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Foydalanuvchi nomi"
            className="w-full bg-white border-none p-4 rounded-xl mt-3 shadow-md focus:border-blue-400 focus:outline-none"
            onChange={handleChange}
            value={formData.username}
            disabled={isLoading || authLoading}
            required
            label="Foydalanuvchi nomi"
          />
          <Input
            type="password"
            name="password"
            placeholder="Parol"
            className="w-full bg-white border-none p-4 rounded-xl mt-3 shadow-md focus:border-blue-400 focus:outline-none"
            onChange={handleChange}
            value={formData.password}
            disabled={isLoading || authLoading}
            required
            label="Parol"
            autoComplete="current-password"
          />
          <span className="block mt-2 ml-2 text-xs text-blue-400">
            <a href="/forgot-password">Parolni unutdingizmi?</a>
          </span>
          <Button
            type="submit"
            text={isLoading || authLoading ? 'Yuklanmoqda...' : 'Kirish'}
            className="w-full font-bold bg-gradient-to-r from-blue-500 to-blue-400 text-white py-4 mt-5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50"
            disabled={isLoading || authLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
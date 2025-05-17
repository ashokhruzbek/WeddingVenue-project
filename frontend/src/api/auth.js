// src/hooks/useAuth.js
import { useState, useEffect, useMemo } from 'react';
import axios from '../utils/axios';
import { API } from '../api/endpoints';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(API.VERIFY_TOKEN, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          throw new Error('Foydalanuvchi ma’lumotlari topilmadi');
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error.message || error);
      localStorage.removeItem('token');
      setError(error.message || 'Autentifikatsiya xatosi');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(API.LOGIN, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { token, user: userData } = response.data;
      if (!token || !userData) {
        throw new Error('Token yoki foydalanuvchi ma’lumotlari topilmadi');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      setError(error.response?.data?.message || 'Kirishda xatolik yuz berdi');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  return useMemo(() => ({ user, login, logout, isLoading, error }), [user, isLoading, error]);
};
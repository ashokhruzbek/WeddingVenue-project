// src/hooks/useAuth.js
import { useState, useEffect, useMemo } from 'react';
import axios from '../utils/axios';
import { API } from '../utils/endpoints';

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
      localStorage.removeItem('user');
      setError(error.message || 'Autentifikatsiya xatosi');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async ({ username, password, userData }) => {
    try {
      setIsLoading(true);
      setError(null);

      if (userData) {
        // If userData is provided (e.g., from Login.jsx), use it directly
        setUser(userData);
        return userData;
      }

      const response = await axios.post(API.LOGIN, { username, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { token, user: fetchedUserData } = response.data;
      if (!token || !fetchedUserData) {
        throw new Error('Token yoki foydalanuvchi ma’lumotlari topilmadi');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(fetchedUserData));
      setUser(fetchedUserData);
      return fetchedUserData;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
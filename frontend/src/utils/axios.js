// src/api/axios.js
import axios from "axios"
import { API_BASE_URL } from "./endpoints"

// Axios instance yaratamiz
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 soniya kutish
})

// So'rov yuborilishidan oldin token qo'shish (authorization)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Javobni qabul qilganda token muddati o'tganini tekshirish
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token muddati tugagan yoki noto'g'ri token
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      window.location.href = "/login"  // Tizimga qayta kirishga yo'naltirish
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

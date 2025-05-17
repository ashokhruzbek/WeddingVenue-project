// src/api/endpoints.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

export const API = {
  // Auth (Tizimga kirish/ro'yxatdan o'tish)
  LOGIN: `${API_BASE_URL}/login`,          // Tizimga kirish
  SIGNUP: `${API_BASE_URL}/signup`,        // Ro'yxatdan o'tish
  VERIFY_TOKEN: `${API_BASE_URL}/verify-token`,  // Token tekshirish

  // Admin (Administrator amallari)
  ADMIN: {
    CREATE_VENUE: `${API_BASE_URL}/admin/create-venue`,        // Yangi joy yaratish
    VIEW_VENUES: `${API_BASE_URL}/admin/view-all-venues`,      // Barcha joylar ro'yxati
    VIEW_OWNERS: `${API_BASE_URL}/admin/view-all-owners`,      // Barcha egalarning ro'yxati
    VIEW_BOOKINGS: `${API_BASE_URL}/admin/view-all-bookings`,  // Barcha bronlar ro'yxati
    APPROVE_VENUE: (id) => `${API_BASE_URL}/admin/approve-venue/${id}`,  // Joyni tasdiqlash
    DELETE_VENUE: (id) => `${API_BASE_URL}/admin/delete-venue/${id}`,    // Joyni o'chirish
    CREATE_OWNER: `${API_BASE_URL}/admin/create-owner`,        // Yangi egani yaratish
    ASSIGN_OWNER: `${API_BASE_URL}/admin/assign-owner`,        // Egani joyga tayinlash
    CANCEL_BOOKING: (id) => `${API_BASE_URL}/admin/cancel-booking/${id}`,  // Bronni bekor qilish
  },

  // Owner (Joy egasi)
  OWNER: {
    REGISTER_VENUE: `${API_BASE_URL}/owner/reg-owner`,               // Joy ro'yxatdan o'tkazish
    VIEW_VENUE: (id) => `${API_BASE_URL}/owner/view-venue/${id}`,    // O'z joyini ko'rish
    UPDATE_VENUE: (id) => `${API_BASE_URL}/owner/update-owner/${id}`,// Joyni yangilash
    VIEW_BOOKINGS: (id) => `${API_BASE_URL}/owner/view-venue-booking/${id}`, // Bronlarni ko'rish
  },

  // User (Foydalanuvchi)
  USER: {
    GET_VENUES: `${API_BASE_URL}/user/get-venues-user`,              // Mavjud joylar ro'yxati
    GET_VENUE: (id) => `${API_BASE_URL}/user/get-venue/${id}`,       // Ma'lum joy haqida ma'lumot
    GET_VENUE_BOOKINGS: (id) => `${API_BASE_URL}/user/get-venue-bookings/${id}`, // Joyga qilingan bronlar
    BOOK_VENUE: `${API_BASE_URL}/user/book-venue`,                   // Joyni bron qilish
    GET_BOOKINGS: `${API_BASE_URL}/user/get-booking-user`,           // O'z bronlari ro'yxati
    CANCEL_BOOKING: (id) => `${API_BASE_URL}/user/cancel-booking/${id}`, // Bronni bekor qilish
  },
}

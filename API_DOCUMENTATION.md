# Wedding Venue Project - API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
Barcha himoyalangan endpointlar uchun JWT token kerak:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### 1. Ro'yxatdan o'tish (Signup)
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "firstname": "Ali",
  "lastname": "Valiyev",
  "username": "alivaliyev",
  "password": "password123",
  "role": "user"  // "admin", "owner", "user"
}
```

**Response:**
```json
{
  "id": 1,
  "firstname": "Ali",
  "lastname": "Valiyev",
  "username": "alivaliyev",
  "role": "user"
}
```

### 2. Kirish (Login)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "alivaliyev",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstname": "Ali",
    "lastname": "Valiyev",
    "username": "alivaliyev"
  }
}
```

---

## 👨‍💼 Admin Endpoints
**Role:** `admin`

### 1. To'yxona yaratish
**POST** `/api/admin/create-venue`

### 2. Owner yaratish
**POST** `/api/admin/create-owner`

### 3. Owner biriktirish
**POST** `/api/admin/assign-owner`

### 4. To'yxonani tasdiqlash
**PUT** `/api/admin/approve-venue/:id`

### 5. To'yxonani yangilash
**PUT** `/api/admin/update-venue/:id`

### 6. To'yxonani o'chirish
**DELETE** `/api/admin/delete-venue/:id`

### 7. Barcha to'yxonalarni ko'rish
**GET** `/api/admin/view-all-venues`

### 8. Barcha ownerlarni ko'rish
**GET** `/api/admin/owners`

### 9. Barcha bronlarni ko'rish
**GET** `/api/admin/view-all-bookings`

### 10. Bronni bekor qilish
**DELETE** `/api/admin/cancel-booking/:id`

---

## 🏢 Owner Endpoints
**Role:** `owner`

### 1. To'yxona ro'yxatga olish
**POST** `/api/owner/reg-owner`

**Form Data:**
- name
- district_id
- address
- capacity
- price_seat
- phone_number
- images[] (file upload)

### 2. To'yxonani yangilash
**PUT** `/api/owner/update-owner/:id`

### 3. To'yxonani o'chirish
**DELETE** `/api/owner/delete-owner-venue/:id`

### 4. O'z to'yxonalarini ko'rish
**GET** `/api/owner/view-owner-venue/:id`

### 5. To'yxona bronlarini ko'rish
**GET** `/api/owner/view-venue-booking/:id`

### 6. Bron qo'shish
**POST** `/api/owner/add-booking`

### 7. Bronni bekor qilish
**DELETE** `/api/owner/cancel-booking/:id`

---

## 👤 User Endpoints
**Role:** `user`

### 1. Barcha to'yxonalarni ko'rish
**GET** `/api/user/get-venues-user`

### 2. Bron qo'shish
**POST** `/api/user/add-booking/:id`

**Request Body:**
```json
{
  "venue_id": 1,
  "reservation_date": "2025-12-25",
  "guest_count": 200,
  "client_phone": "+998901234567",
  "status": "endi bo`ladigan"
}
```

### 3. O'z bronlarini ko'rish
**GET** `/api/user/get-user-booking/:id`

### 4. Bronni bekor qilish
**DELETE** `/api/user/cancel-booking/:id`

### 5. Bo'sh kunlarni ko'rish
**GET** `/api/user/get-available-dates?venue_id=1&month=12&year=2025`

---

## 🏛️ Venues Endpoints
**Public** - Autentifikatsiya shart emas

### 1. Barcha to'yxonalarni ko'rish
**GET** `/api/venues/venues`

**Response:**
```json
{
  "message": "Barcha to'yxonalar ro'yxati",
  "count": 10,
  "venues": [
    {
      "id": 1,
      "name": "Grand Palace",
      "district_id": 1,
      "address": "Toshkent shahar, Yunusobod tumani",
      "capacity": 500,
      "price_seat": 150000,
      "phone_number": "+998901234567",
      "status": "tasdiqlangan",
      "owner_id": 2,
      "images": [
        {
          "id": 1,
          "image_url": "http://localhost:4000/uploads/venue1.jpg"
        }
      ]
    }
  ]
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Barcha maydonlar to'ldirilishi shart"
}
```

### 401 Unauthorized
```json
{
  "message": "Token muddati tugagan"
}
```

### 403 Forbidden
```json
{
  "message": "Bu API ga murojaat qilishingizga huquqingiz yo'q"
}
```

### 404 Not Found
```json
{
  "message": "To'yxona topilmadi"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server xatosi",
  "error": "Error details..."
}
```

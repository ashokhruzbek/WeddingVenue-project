### Wedding Venue Project semester topshirig'i Frontend va Backend 

## 📋 Loyiha haqida
To'yxonalarni boshqarish va bron qilish tizimi. Uch xil foydalanuvchi roli: Admin, Owner (To'yxona egasi) va User (Foydalanuvchi).

## 🚀 Loyihani ishga tushirish

### Backend ishga tushirish

1. Backend papkasiga o'ting:
```bash
cd backend
```

2. Kerakli paketlarni o'rnating:
```bash
npm install
```

3. `.env.example` faylidan `.env` yarating va to'ldiring:
```bash
cp .env.example .env
```

4. PostgreSQL databaseni sozlang:
   - `postgres-database/create-table-codes.sql` - jadvallar yaratish
   - `postgres-database/insert-data.sql` - dastlabki ma'lumotlar

5. Serverni ishga tushiring:
```bash
npm run dev    # Development rejimda
# yoki
npm start      # Production rejimda
```

Server http://localhost:4000 da ishga tushadi.

### Frontend ishga tushirish

1. Frontend papkasiga o'ting:
```bash
cd frontend
```

2. Kerakli paketlarni o'rnating:
```bash
npm install
```

3. Development serverni ishga tushiring:
```bash
npm run dev
```

Frontend http://localhost:5173 da ishga tushadi.

## 🛠️ Texnologiyalar

### Backend
- Node.js & Express.js
- PostgreSQL
- JWT (Authentication)
- Bcrypt (Password hashing)
- Multer (File upload)

### Frontend
- React 19
- Vite
- TailwindCSS
- Axios
- React Router DOM
- Framer Motion
- React DatePicker

## 📁 Loyiha strukturasi

```bash
frontend/                                # Frontend ilova papkasi
├── hooks/                              # Maxsus React hooklar
│   └── useAuth.js                      # Avtorizatsiya uchun hook
├── public/                            # Statik fayllar (index.html, rasmlar va boshqalar)
├── src/                               # Asosiy kodlar papkasi
│   ├── components/                    # Qayta ishlatiladigan React komponentlari
│   │   ├── PrivateRoute.jsx           # Maxfiy sahifalar uchun route
│   │   ├── PublicRoute.jsx            # Ochiq sahifalar uchun route
│   │   ├── footer/                    # Footer komponentlari
│   │   │   └── Footer.jsx
│   │   ├── header/                    # Header komponentlari
│   │   │   └── Header.jsx
│   │   └── sidebar/                   # Sidebar komponentlari
│   │       └── Sidebar.jsx
│   ├── layouts/                      # Turli foydalanuvchi rollari uchun layoutlar
│   │   ├── AdminLayout.jsx           # Admin uchun layout
│   │   ├── MainLayout.jsx            # Umumiy layout
│   │   ├── OwnerLayout.jsx           # To’yxona egasi uchun layout
│   │   └── UserLayout.jsx            # Oddiy foydalanuvchi uchun layout
│   ├── pages/                       # Har bir sahifa (role, maqsadga qarab)
│   │   ├── admin/                   # Admin sahifalari
│   │   │   ├── AllDistricts.jsx
│   │   │   ├── AllUsers.jsx
│   │   │   ├── ApproveVenue.jsx
│   │   │   ├── AssignOwner.jsx
│   │   │   ├── CreateVenue.jsx
│   │   │   ├── index.jsx
│   │   │   ├── ManageBooking.jsx
│   │   │   └── ViewAllVenues.jsx
│   │   ├── auth/                    # Avtorizatsiya sahifalari
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── home/                    # Bosh sahifa
│   │   │   └── Home.jsx
│   │   ├── landing/                 # Kirish sahifasi, landing page
│   │   │   └── index.jsx
│   │   ├── notFound/                # 404 sahifa
│   │   │   └── NotFound.jsx
│   │   ├── owner/                  # To’yxona egasi sahifalari
│   │   │   ├── AddVenues.jsx
│   │   │   ├── AllDistricts.jsx
│   │   │   ├── AllVenues.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── index.jsx
│   │   │   ├── UpdateVenues.jsx
│   │   │   └── VenueBooking.jsx
│   │   └── user/                   # Oddiy foydalanuvchi sahifalari
│   │       ├── FavoritesVenues.jsx
│   │       ├── index.jsx
│   │       ├── UserBooking.jsx
│   │       └── Venues.jsx
│   ├── routes/                    # Routing konfiguratsiyasi
│   │   └── index.jsx
│   ├── App.js                     # Asosiy React komponenti (Router shu yerda)
│   ├── global.css                 # Umumiy stil fayllar
│   ├── index.css
│   ├── main.jsx                   # React root fayli, ilovani DOMga ulaydi
│   └── react-datepicker.css       # Tashqi kutubxona uchun CSS
├── .gitignore                    # Git uchun e'tiborga olinmaydigan fayllar ro'yxati
├── eslint.config.js              # ESLint konfiguratsiyasi
├── index.html                   # Frontend uchun asosiy html fayl
├── package-lock.json            # Paketlar aniq versiyasi uchun
├── package.json                 # NPM paketlar ro'yxati va skriptlar
├── postcss.config.js            # PostCSS konfiguratsiyasi (masalan, Tailwind bilan)
├── README.md                   # Loyihaning qisqacha ma'lumot fayli
├── tailwind.config.js           # TailwindCSS konfiguratsiyasi
└── vite.config.js               # Vite bundler konfiguratsiyasi
```
### Backend
```bash
backend/                             # Backend ilova papkasi
├── config/                         # Loyihaning konfiguratsiya fayllari
│   └── db.js                      # Ma'lumotlar bazasi ulanish konfiguratsiyasi
├── controllers/                   # Biznes mantiq uchun controller fayllar
│   ├── admin/                    # Admin sohalariga oid controllerlar
│   │   ├── approveVenue.js
│   │   ├── assignOwner.js
│   │   ├── cancelBooking.js
│   │   ├── createOwner.js
│   │   ├── createVenue.js
│   │   ├── deleteVenue.js
│   │   ├── singleVenue.js
│   │   ├── updateVenue.js
│   │   ├── view-all-Venues.js
│   │   ├── viewAllBooking.js
│   │   ├── viewAllOwners.js
│   │   └── viewFilteredVenues.js
│   ├── auth/                     # Auth uchun controllerlar
│   │   ├── login.js
│   │   └── signup.js
│   ├── owner/                    # To’yxona egasi uchun controllerlar
│   │   ├── addBooking.js
│   │   ├── cancelBooking.js
│   │   ├── getVenueBooking.js
│   │   ├── registerVenueByOwner.js
│   │   └── updateVenueOwner.js
│   ├── user/                     # Oddiy foydalanuvchi controllerlari
│   │   ├── addBooking.js
│   │   ├── cancelBooking.js
│   │   ├── getAllVenuesForUser.js
│   │   ├── getAvailableDates.js
│   │   └── getUserBooking.js
│   └── venues.js                 # Umumiy venues bilan bog‘liq controller
├── middlewares/                 # Middleware lar (auth, ruxsat, upload va h.k.)
│   ├── authentication.js        # JWT yoki boshqa auth middleware
│   ├── checkRole.js             # Foydalanuvchi rolini tekshirish
│   └── uploadFile.js            # Fayl yuklash middleware (multer asosida)
├── routes/                     # API marshrutlari
│   ├── admin/                  # Admin API yo‘llari
│   │   └── adminRoutes.js
│   ├── auth/                   # Auth API yo‘llari
│   │   └── authRoutes.js
│   ├── owner/                  # To’yxona egasi API yo‘llari
│   │   └── ownerRoutes.js
│   ├── user/                   # Oddiy foydalanuvchi API yo‘llari
│   │   └── userRouter.js
│   └── venuesRouter.js         # To’yxonalar API yo‘llari
├── uploads/                    # Yuklangan fayllar saqlanadigan papka
│   ├── users/                   # Foydalanuvchi rasmlari
│   └── venues/                 # To’yxona rasmlari
├── .env                       # Muhit o‘zgaruvchilari (DB parollari, JWT kalit va h.k.)
├── .gitignore                 # Git uchun e'tiborga olinmasligi kerak bo‘lgan fayllar
├── package-lock.json          # Paketlar aniq versiyasi uchun
├── package.json               # NPM paketlar ro'yxati va skriptlar
└── server.js                  # Express server boshlovchi fayl
```

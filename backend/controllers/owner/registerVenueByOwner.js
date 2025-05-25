const pool = require('../../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/venues/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Faqat JPG, PNG yoki GIF rasmlar yuklanadi!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).array('images', 5); // Maksimal 5 ta rasm

exports.registerVenueByOwner = [
  // Multer middleware ni array ichida ishlatish
  upload,
  async (req, res) => {
    try {
      const owner_id = req.user?.id; // Token orqali keladi
      const status = 'tasdiqlanmagan'; // Doimiy holat

      // Token mavjudligini tekshirish
      if (!owner_id) {
        return res.status(401).json({ message: "Token noto'g'ri yoki foydalanuvchi aniqlanmadi" });
      }

      // Multer orqali kelgan ma'lumotlarni olish
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);

      const {
        name,
        district_id,
        address,
        capacity,
        price_seat,
        phone_number,
      } = req.body;

      // 1. Maydonlar to'liqmi
      if (!name || !district_id || !address || !capacity || !price_seat || !phone_number) {
        return res.status(400).json({ 
          message: "Barcha maydonlar to'ldirilishi shart",
          received: { name, district_id, address, capacity, price_seat, phone_number }
        });
      }

      // 2. Telefon raqamini tekshirish
      const phoneRegex = /^\+998\d{9}$/;
      if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({
          message: "Telefon raqami noto'g'ri formatda, masalan: +998901234567",
        });
      }

      // 3. Rasmlar mavjudligini tekshirish
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Kamida bitta rasm yuklang" });
      }

      // 4. Owner mavjudligini tekshirish
      const checkOwner = await pool.query("SELECT * FROM users WHERE id = $1", [owner_id]);
      if (checkOwner.rows.length === 0) {
        return res.status(400).json({ message: "Bunday owner mavjud emas" });
      }

      // 5. Takror nom bo'yicha tekshirish
      const checkVenue = await pool.query(
        `SELECT id FROM venues WHERE LOWER(name) = LOWER($1) AND owner_id = $2`,
        [name.trim(), owner_id]
      );
      if (checkVenue.rowCount > 0) {
        return res.status(400).json({ message: "Siz bu nomdagi to'yxonani allaqachon qo'shgansiz" });
      }

      // 6. To'yxonani qo'shish
      const newVenue = await pool.query(
        `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, district_id, address, Number(capacity), Number(price_seat), phone_number, status, owner_id]
      );

      const venueId = newVenue.rows[0].id;

      // 7. Rasmlarni images jadvaliga qo'shish
      const imageInsertPromises = req.files.map((file) =>
        pool.query(
          `INSERT INTO images (venue_id, image_url)
           VALUES ($1, $2)
           RETURNING *`,
          [venueId, file.path]
        )
      );

      await Promise.all(imageInsertPromises);

      res.status(201).json({
        message: "To'yxona muvaffaqiyatli ro'yxatdan o'tkazildi. Admin tasdiqlashi kutilmoqda.",
        venue: newVenue.rows[0],
      });

    } catch (error) {
      console.error("To'yxona qo'shishda xatolik:", error.message);
      console.error(error.stack);
      
      // Xatolik yuz bersa, yuklangan fayllarni o'chirish
      if (req.files) {
        req.files.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error("Faylni o'chirishda xatolik:", unlinkError.message);
          }
        });
      }
      
      res.status(500).json({ 
        message: "Server xatosi", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
]; 
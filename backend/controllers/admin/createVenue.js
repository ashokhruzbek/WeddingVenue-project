const pool = require('../../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
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
}).array('images', 5); // Allow up to 5 images

exports.createVenue = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const owner_id = req.user?.id;

      if (!owner_id) {
        return res.status(401).json({ message: "Token noto‘g‘ri yoki foydalanuvchi aniqlanmadi" });
      }

      const { name, district_id, address, capacity, price_seat, phone_number } = req.body;

      if (!name || !district_id || !address || !capacity || !price_seat || !phone_number) {
        return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi shart" });
      }

      const phoneRegex = /^\+998\d{9}$/;
      if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({
          message: "Telefon raqami noto‘g‘ri formatda, masalan: +998912345678",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Kamida bitta rasm yuklang" });
      }

      const checkOwner = await pool.query("SELECT * FROM users WHERE id = $1", [owner_id]);
      if (checkOwner.rows.length === 0) {
        return res.status(400).json({ message: "Bunday owner mavjud emas" });
      }

      const checkVenue = await pool.query(
        "SELECT * FROM venues WHERE LOWER(name) = LOWER($1) AND owner_id = $2",
        [name, owner_id]
      );
      if (checkVenue.rows.length !== 0) {
        return res.status(400).json({
          message: "Siz bu nomdagi to‘yxonani allaqachon qo‘shgansiz",
        });
      }

      const status = "tasdiqlanmagan";

      const venueResult = await pool.query(
        `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, district_id, address, Number(capacity), Number(price_seat), phone_number, status, owner_id]
      );

      const venueId = venueResult.rows[0].id;

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
        message: "To‘yxona muvaffaqiyatli yaratildi",
        venue: venueResult.rows[0],
      });
    } catch (error) {
      console.error("Venue yaratishda xatolik:", error.message);
      console.error(error.stack);
      res.status(500).json({
        message: "Server xatosi",
        error: error.message,
      });
    }
  });
};
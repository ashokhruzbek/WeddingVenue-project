  const pool = require('../../config/db')
exports.createVenue = async (req, res) => {
  try {
    // Token orqali kirgan user ID ni olish
    const owner_id = req.user?.id;

    // Agar owner_id yo'q bo‘lsa (ya'ni foydalanuvchi autentifikatsiyadan o‘tmagan)
    if (!owner_id) {
      return res.status(401).json({ message: "Token noto‘g‘ri yoki foydalanuvchi aniqlanmadi" });
    }

    const { name, district_id, address, capacity, price_seat, phone_number } = req.body;

    // Barcha maydonlar borligini tekshirish
    if (!name || !district_id || !address || !capacity || !price_seat || !phone_number) {
      return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi shart" });
    }

    // Telefon raqamini tekshirish
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        message: "Telefon raqami noto‘g‘ri formatda, masalan: +998912345678",
      });
    }

    // Foydalanuvchi mavjudligini tekshirish
    const checkOwner = await pool.query("SELECT * FROM users WHERE id = $1", [owner_id]);
    if (checkOwner.rows.length === 0) {
      return res.status(400).json({ message: "Bunday owner mavjud emas" });
    }

    // To'yxona nomi takrorlanmasligini tekshirish
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

    // Yangi venue yaratish
    const result = await pool.query(
      `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, district_id, address, capacity, price_seat, phone_number, status, owner_id]
    );

    res.status(201).json({
      message: "To‘yxona muvaffaqiyatli yaratildi",
      venue: result.rows[0],
    });
  } catch (error) {
    console.error("Venue yaratishda xatolik:", error.message);
    console.error(error.stack);
    res.status(500).json({
      message: "Server xatosi",
      error: error.message,
    });
  }
};

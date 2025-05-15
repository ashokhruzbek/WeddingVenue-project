const pool = require('../../config/db');

exports.registerVenueByOwner = async (req, res) => {
  try {
    const {
      name,
      district_id,
      address,
      capacity,
      price_seat,
      phone_number
    } = req.body;

    const owner_id = req.user.id; // Token orqali keladi
    const status = 'tasdiqlanmagan'; // doimiy holat

    // 1. Maydonlar to‘liqmi
    if (!name || !district_id || !address || !capacity || !price_seat || !phone_number) {
      return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi shart" });
    }

    // 2. Telefon raqamini tekshirish
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ message: "Telefon raqami noto‘g‘ri formatda, masalan: +998901234567" });
    }

    // 3. Takror nom bo‘yicha tekshirish
    const checkVenue = await pool.query(
      `SELECT id FROM venues WHERE LOWER(name) = LOWER($1) AND owner_id = $2`,
      [name.trim(), owner_id]
    );
    if (checkVenue.rowCount > 0) {
      return res.status(400).json({ message: "Siz bu nomdagi to‘yxonani allaqachon qo‘shgansiz" });
    }

    // 4. To‘yxonani qo‘shish
    const newVenue = await pool.query(
      `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, district_id, address, capacity, price_seat, phone_number, status, owner_id]
    );

    res.status(201).json({
      message: "To‘yxona muvaffaqiyatli ro‘yxatdan o‘tkazildi. Admin tasdiqlashi kutilmoqda.",
      venue: newVenue.rows[0]
    });

  } catch (error) {
    console.error("To‘yxona qo‘shishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

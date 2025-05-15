const pool = require("../../config/db");

exports.createVenue = async (req, res) =>{
    try {
    const { name, district_id, address, capacity, price_seat, phone_number, owner_id } = req.body;

    // Barcha maydonlar to‘ldirilganini tekshirish
    if (!name || !district_id || !address || !capacity || !price_seat || !phone_number || !owner_id) {
      return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi shart" });
    }

    // Owner mavjudligini tekshirish
    const checkOwner = await pool.query('SELECT * FROM users WHERE id = $1', [owner_id]);
    if (checkOwner.rows.length === 0) {
      return res.status(400).json({ message: 'Bunday owner mavjud emas' });
    }

    // Telefon raqamini tekshirish
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ message: 'Telefon raqami noto‘g‘ri formatda, masalan: +998912345678' });
    }

    // Oldin shu nomdagi to’yxona mavjudmi (bir xil owner uchun)
    const checkVenue = await pool.query(
      'SELECT * FROM venues WHERE LOWER(name) = LOWER($1) AND owner_id = $2',
      [name, owner_id]
    );
    if (checkVenue.rows.length !== 0) {
      return res.status(400).json({ message: 'Siz bu nomdagi to’yxonani allaqachon qo‘shgansiz' });
    }

    // Status har doim "tasdiqlanmagan"
    const status = 'tasdiqlanmagan';

    // Yangi to’yxona qo‘shish
    const result = await pool.query(
      `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, district_id, address, capacity, price_seat, phone_number, status, owner_id]
    );

    res.status(201).json({ message: 'To‘yxona muvaffaqiyatli yaratildi', venue: result.rows[0] });
  } catch (error) {
    console.error('Venue yaratishda xatolik:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
}
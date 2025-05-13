const pool = require('../../config/db');

exports.createVenue = async (req, res) => {
  try {
    // req.body dan barcha kerakli ma'lumotlarni olish
    const { name, district_id, address, capacity, price_seat, phone_number, status, owner_id } = req.body;
    const userRole = req.user.role;

    // 1. Validatsiya: Barcha maydonlar to'ldirilganligini tekshirish
    if (!name || !district_id || !address || !capacity || !price_seat || !phone_number || !status || !owner_id) {
      return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi shart" });
    }

    // 2. Ruxsat tekshiruvi: Foydalanuvchi roli
    if (userRole !== 'owner' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Ruxsat etilmagan' });
    }

    // 3. owner_id ni tekshirish: Mavjudligi va ruxsat
    const checkOwner = await pool.query('SELECT * FROM users WHERE id = $1', [owner_id]);
    if (checkOwner.rows.length === 0) {
      return res.status(400).json({ message: 'Bunday owner mavjud emas' });
    }

    // Agar admin bo'lmasa, faqat o'z owner_id si bilan ishlashi mumkin
    if (userRole !== 'admin' && owner_id != req.user.id) {
      return res.status(403).json({ message: 'Faqat admin boshqa owner uchun to‘yxona yaratishi mumkin' });
    }

    // 4. Statusni validatsiya qilish (faqat "tasdiqlangan" yoki "tasdiqlanmagan" bo'lishi mumkin)
    const validStatuses = ['tasdiqlangan', 'tasdiqlanmagan'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status faqat "tasdiqlangan" yoki "tasdiqlanmagan" bo‘lishi mumkin' });
    }

    // Agar admin bo'lmasa, status faqat "tasdiqlanmagan" bo'lishi mumkin
    if (userRole !== 'admin' && status === 'tasdiqlangan') {
      return res.status(403).json({ message: 'Faqat admin statusni "tasdiqlangan" qilib qo‘yishi mumkin' });
    }

    // 5. Telefon raqamini validatsiya qilish (masalan, +998 bilan boshlanishi kerak)
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ message: 'Telefon raqami noto‘g‘ri formatda, masalan: +998912345678' });
    }

    // 6. Tekshiruv: Shu owner shu nom bilan to’yxona qo‘shganmi?
    const checkVenue = await pool.query(
      'SELECT * FROM venues WHERE LOWER(name) = LOWER($1) AND owner_id = $2',
      [name, owner_id]
    );

    if (checkVenue.rows.length !== 0) {
      return res.status(400).json({ message: 'Siz bu nomdagi to’yxonani allaqachon qo‘shgansiz' });
    }

    // 7. INSERT so'rovi
    const result = await pool.query(
      `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        district_id,
        address,
        capacity,
        price_seat,
        phone_number,
        status,
        owner_id
      ]
    );

    // 8. Muvaffaqiyatli javob
    res.status(201).json({ message: 'To‘yxona muvaffaqiyatli yaratildi', venue: result.rows[0] });
  } catch (error) {
    console.error('Venue yaratishda xatolik:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};
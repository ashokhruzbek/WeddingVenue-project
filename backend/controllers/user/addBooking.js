// controllers/bookingController.js
const pool = require('../../config/db');

exports.addBooking = async (req, res) => {
  try {
    // req.user ni xavfsiz tekshirish
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Foydalanuvchi autentifikatsiyadan o‘tmadi' });
    }

    const user_id = req.user.id;
    const venue_id = req.params.id; // venue_id ni URL parametridan olish
    const { reservation_date, guest_count, client_phone, status: incomingStatus } = req.body;

    // Default holat: "endi bo‘ladigan"
    let status = 'endi bo`ladigan';
    const allowedStatuses = ['endi bo`ladigan', 'bo`lib o`tgan'];

    if (incomingStatus && allowedStatuses.includes(incomingStatus)) {
      status = incomingStatus;
    }

    // Validatsiya: majburiy maydonlarni tekshirish
    if (!venue_id || !reservation_date || !guest_count || !client_phone) {
      return res.status(400).json({ error: 'Barcha maydonlar to‘ldirilishi shart' });
    }

    // Telefon raqam validatsiyasi
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(client_phone)) {
      return res.status(400).json({ error: 'Telefon raqami noto‘g‘ri formatda (masalan: +998901234567)' });
    }

    const bookingDate = new Date(reservation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugungi sanani 00:00:00 ga o‘rnatamiz
    bookingDate.setHours(0, 0, 0, 0); // Bron sanasini 00:00:00 ga o‘rnatamiz

    // Sana tekshiruvi: faqat kelajak bo‘lishi kerak, faqat "endi bo‘ladigan" holatda
    if (status === 'endi bo`ladigan' && bookingDate <= today) {
      return res.status(400).json({ error: 'Bron sanasi bugundan keyin bo‘lishi kerak' });
    }

    // To‘yxona mavjudligini tekshirish
    const venueResult = await pool.query(
      'SELECT id, capacity FROM venues WHERE id = $1 AND status = $2',
      [venue_id, 'tasdiqlangan']
    );

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: 'To‘yxona topilmadi yoki tasdiqlanmagan' });
    }

    const venue = venueResult.rows[0];

    // Sig‘imdan oshmasligini tekshirish
    if (guest_count > venue.capacity) {
      return res.status(400).json({ error: 'Odamlar soni to‘yxona sig‘imidan oshib ketdi' });
    }

    // Sana bo‘yicha bandlikni tekshirish
    const existingBooking = await pool.query(
      'SELECT id FROM bookings WHERE venue_id = $1 AND reservation_date = $2',
      [venue_id, reservation_date]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ error: 'Bu sanada to‘yxona allaqachon bron qilingan' });
    }

    // Bronni qo‘shish
    const result = await pool.query(
      `INSERT INTO bookings (venue_id, reservation_date, guest_count, client_phone, user_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [venue_id, reservation_date, guest_count, client_phone, user_id, status]
    );

    res.status(201).json({
      message: 'Bron muvaffaqiyatli qo‘shildi',
      booking: result.rows[0],
    });
  } catch (err) {
    console.error('Bron qo‘shishda xatolik:', err);
    res.status(500).json({ error: 'Bron qo‘shishda xatolik yuz berdi' });
  }
};
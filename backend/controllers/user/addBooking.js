const pool = require('../../config/db'); // db.js faylga havola

// Yangi bron qo‘shish (foydalanuvchi uchun)
exports.addBooking = async (req, res) => {
  const { venue_id, reservation_date, guest_count, client_phone } = req.body;
  const user_id = req.user.id; // Autentifikatsiyadan olingan user_id
  const status = 'endi bo`ladigan'; // Default holat
  const today = new Date('2025-05-14T18:28:00+05:00'); // Bugungi sana va vaqt (06:28 PM +05)

  try {
    // Validatsiya
    if (!venue_id || !reservation_date || !guest_count || !client_phone) {
      return res.status(400).json({ error: 'Barcha maydonlar to‘ldirilishi shart' });
    }

    // Sana kelajakda ekanligini tekshirish
    const bookingDate = new Date(reservation_date);
    if (bookingDate <= today) {
      return res.status(400).json({ error: 'Bron sanasi bugundan keyin bo‘lishi kerak' });
    }

    // To‘yxona mavjudligini tekshirish
    const venueResult = await pool.query(
      'SELECT id, capacity FROM Venues WHERE id = $1 AND status = $2',
      [venue_id, 'tasdiqlangan']
    );
    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: 'To‘yxona topilmadi yoki tasdiqlanmagan' });
    }

    const venue = venueResult.rows[0];
    // Sig‘imni tekshirish
    if (guest_count > venue.capacity) {
      return res.status(400).json({ error: 'Odamlar soni to‘yxona sig‘imidan oshib ketdi' });
    }

    // Ushbu sanada bron mavjudligini tekshirish
    const existingBooking = await pool.query(
      'SELECT id FROM Bookings WHERE venue_id = $1 AND reservation_date = $2',
      [venue_id, reservation_date]
    );
    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ error: 'Bu sanada to‘yxona allaqachon bron qilingan' });
    }

    // Bron qo‘shish
    const result = await pool.query(
      `INSERT INTO Bookings (venue_id, reservation_date, guest_count, client_phone, user_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [venue_id, reservation_date, guest_count, client_phone, user_id, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bron qo‘shishda xatolik yuz berdi' });
  }
};

const pool = require('../../config/db');

exports.getAvailableDates = async (req, res) => {
  try {
    const venueId = req.params.id;

    // 1. To‘yxona mavjudligini tekshirish
    const venueCheck = await pool.query('SELECT capacity FROM venues WHERE id = $1 AND status = $2', [venueId, 'tasdiqlangan']);
    if (venueCheck.rowCount === 0) {
      return res.status(404).json({ message: 'To‘yxona topilmadi yoki tasdiqlanmagan' });
    }
    const venueCapacity = venueCheck.rows[0].capacity;

    // 2. Bron qilingan kunlarni olish
    const bookings = await pool.query('SELECT reservation_date, guest_count FROM bookings WHERE venue_id = $1', [venueId]);

    // 3. Kunlarni saralash va band kunlarni belgilash
    // Bu yerda siz serverda yoki frontendda sanalar bilan ishlash mumkin
    // Masalan, 30 kunlik oraliqda bo‘sh kunlarni topish
    const bookedDates = {};

    bookings.rows.forEach(b => {
      bookedDates[b.reservation_date.toISOString().split('T')[0]] = b.guest_count;
    });

    res.status(200).json({
      message: 'To‘yxona uchun band va bo‘sh kunlar',
      capacity: venueCapacity,
      bookedDates: bookedDates
    });

  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

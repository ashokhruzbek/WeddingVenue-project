const pool = require('../../config/db');

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userRole = req.user.role;
    const userId = req.user.id;

    // 1. Bron mavjudligini tekshirish
    const existing = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }

    const booking = existing.rows[0];

    // 2. Admin har qanday bronni o‘chira oladi
    if (userRole === 'admin') {
      await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
      return res.status(200).json({ message: "Bron bekor qilindi (admin tomonidan)" });
    }

    // 3. Egasi (owner) o‘z to‘yxonasidagi bronni o‘chira oladi
    if (userRole === 'owner') {
      const venueCheck = await pool.query(`
        SELECT v.id
        FROM venues v
        WHERE v.id = $1 AND v.owner_id = $2
      `, [booking.venue_id, userId]);

      if (venueCheck.rowCount > 0) {
        await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
        return res.status(200).json({ message: "Bron bekor qilindi (egasi tomonidan)" });
      }
    }

    // 4. User o‘z bronini bekor qila oladi
    if (userRole === 'user' && booking.user_id === userId) {
      await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
      return res.status(200).json({ message: "Bron bekor qilindi (foydalanuvchi tomonidan)" });
    }

    // 5. Ruxsat yo‘q
    return res.status(403).json({ message: "Bu bronni o‘chirishga ruxsatingiz yo‘q" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
  }
};

const pool = require('../../config/db');

exports.cancelOwnerBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Bron mavjudligini tekshiramiz
    const existing = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }

    const booking = existing.rows[0];

    // 4. Owner o‘z to‘yxonasiga tegishli bronni o‘chira oladi
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

    // Aks holda, ruxsat yo‘q
    return res.status(403).json({ message: "Bu bronni o'chirishga ruxsatingiz yo'q" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
  }
};

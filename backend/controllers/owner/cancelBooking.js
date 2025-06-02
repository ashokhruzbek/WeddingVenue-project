const pool = require('../../config/db');

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const user = req.user;
    const userId = req.user.id;

    // Foydalanuvchi ma'lumotlari tekshiruvi
    if (!user || !user.id) {
      return res.status(401).json({ message: "Foydalanuvchi autentifikatsiyadan o‘tmagan" });
    }


    // 1. Bron mavjudligini tekshirish
    const existing = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }

    const booking = existing.rows[0];

    // 2. Egasi (owner) o‘z to‘yxonasidagi bronni o‘chira oladi
    const venueCheck = await pool.query(`
      SELECT v.id
      FROM venues v
      WHERE v.id = $1 AND v.owner_id = $2
    `, [booking.venue_id, userId]);

    if (venueCheck.rowCount > 0) {
      await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
      return res.status(200).json({ message: "Bron bekor qilindi (egasi tomonidan)" });
    }

    // 3. Ruxsat yo‘q
    return res.status(403).json({ message: "Bu bronni o‘chirishga ruxs2atingiz yo‘q" });

  } catch (error) {
    console.error("Bronni bekor qilishda xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

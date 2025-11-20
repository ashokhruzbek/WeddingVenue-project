const pool = require('../../config/db');

exports.getVenueBookings = async (req, res) => {
  try {
    const venue_id = req.params.id;

    // Owner mavjudligini tekshirish (optional, lekin tavsiya qilinadi)
    const ownerCheck = await pool.query('SELECT id FROM bookings WHERE id = $1', [venue_id]);
    if (ownerCheck.rowCount === 0) {
      return res.status(200).json({ message: "Sizda to'yxonangizda bronlar yo'q" });
    }

    // Bronlarni olish
    const query = `
      SELECT 
        b.id AS booking_id,
        v.name AS venue_name,
        b.reservation_date,
        b.guest_count,
        b.client_phone,
        u.firstname,
        u.lastname,
        b.status
      FROM bookings as b
      INNER JOIN venues v ON b.venue_id = v.id
      INNER JOIN users u ON b.user_id = u.id
      WHERE b.venue_id = $1
      ORDER BY b.reservation_date ASC
    `;

    const { rows } = await pool.query(query, [venue_id]);

    return res.status(200).json({
      message: "Sizning to‘yxonaning bronlari",
      bookings: rows
    });

  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

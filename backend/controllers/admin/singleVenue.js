const pool = require("../../config/db");

// Yakka to‘yxona ma'lumotlarini olish (shu jumladan suratlar va bronlar bilan)
exports.getSingleVenue = async (req, res) => {
  const { id } = req.params;

  try {
    // To‘yxona ma'lumotlarini olish (Venues va District bilan JOIN)
    const venueResult = await pool.query(
      `SELECT v.id, v.name, d.name AS district, v.address, v.capacity, v.price_seat, v.phone_number, v.status
       FROM Venues v
       JOIN District d ON v.district_id = d.id
       WHERE v.id = $1`,
      [id]
    );

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: "To‘yxona topilmadi" });
    }

    const venue = venueResult.rows[0];

    // To‘yxona suratlarini olish
    const imagesResult = await pool.query(
      "SELECT image_url FROM Images WHERE venue_id = $1",
      [id]
    );
    venue.images = imagesResult.rows.map((img) => img.image_url);

    // To‘yxonaga tegishli bronlarni olish
    const bookingsResult = await pool.query(
      `SELECT b.id, b.reservation_date, b.guest_count, b.client_phone, b.status,
              u.firstname, u.lastname
       FROM Bookings b
       JOIN Users u ON b.user_id = u.id
       WHERE b.venue_id = $1`,
      [id]
    );
    venue.bookings = bookingsResult.rows;

    res.status(200).json(venue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
};

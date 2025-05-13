const pool = require('../../config/db');

exports.updateVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { name, district_id, address, capacity, price_seat, phone_number } = req.body;

    // Avval venue mavjudligini tekshiramiz
    const venueResult = await pool.query('SELECT * FROM venues WHERE id = $1', [venueId]);

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ message: "To'yxona topilmadi" });
    }


    const updatedVenue = await pool.query(`
      UPDATE venues
      SET name = $1,
          district_id = $2,
          address = $3,
          capacity = $4,
          price_seat = $5,
          phone_number = $6
      WHERE id = $7
      RETURNING *;
    `, [name, district_id, address, capacity, price_seat, phone_number, venueId]);

    res.status(200).json({
      message: "To'yxona ma'lumotlari yangilandi",
      venue: updatedVenue.rows[0]
    });

  } catch (error) {
    console.error("Venue yangilashda xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik" });
  }
};

const pool = require('../../config/db');

exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params; // venue id

    // Venue mavjudligini tekshirish
    const venueResult = await pool.query('SELECT * FROM venues WHERE id = $1', [id]);

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ message: 'Venue topilmadi' });
    }

    const venue = venueResult.rows[0];

    // Venue ni o‘chirish
    await pool.query('DELETE FROM venues WHERE id = $1', [id]);

    res.status(200).json({ message: `Venue ID ${id} o‘chirildi` });
  } catch (error) {
    console.error('Venue o‘chirishda xatolik:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

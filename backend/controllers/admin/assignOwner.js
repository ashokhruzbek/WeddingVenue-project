const pool = require('../../config/db');

exports.assignOwner = async (req, res) => {
  try {
    const { venue_id, owner_id } = req.body;

    // Tekshiruvlar
    if (!venue_id || !owner_id) {
      return res.status(400).json({ message: 'venue_id va owner_id talab qilinadi' });
    }

    // Owner mavjudligini tekshirish
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [owner_id, 'owner']);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: `Owner topilmadi yoki foydalanuvchi 'owner' emas` });
    }

    // Venue mavjudligini tekshirish
    const venueResult = await pool.query('SELECT * FROM venues WHERE id = $1', [venue_id]);
    if (venueResult.rows.length === 0) {
      return res.status(404).json({ message: 'Venue topilmadi' });
    }

    // Biriktirish
    await pool.query('UPDATE venues SET owner_id = $1 WHERE id = $2', [owner_id, venue_id]);

    res.status(200).json({ message: `Venue ID ${venue_id} ga Owner ID ${owner_id} biriktirildi` });

  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};



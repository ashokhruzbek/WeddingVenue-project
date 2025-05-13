const pool = require('../../config/db');

exports.viewAllVenues = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let query = '';
    let params = [];

    if (userRole === 'admin') {
      query = `SELECT * FROM venues ORDER BY id DESC`;
    } else if (userRole === 'owner') {
      query = `SELECT * FROM venues WHERE owner_id = $1 ORDER BY id DESC`;
      params = [userId];
    } else {
      return res.status(403).json({ message: 'Sizga ruxsat yo‘q' });
    }

    const result = await pool.query(query, params);
    const venues = result.rows;

    res.status(200).json({ venues });
  } catch (error) {
    console.error('Venue ko‘rsatishda xatolik:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

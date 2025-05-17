const pool = require('../../config/db');

exports.getAllVenuesForUser = async (req, res) => {
  try {
    const { sort_by, order, district_id, search } = req.query;

    let baseQuery = `SELECT * FROM venues WHERE status = 'tasdiqlangan'`;
    const params = [];

    if (district_id) {
      params.push(district_id);
      baseQuery += ` AND district_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      baseQuery += ` AND LOWER(name) LIKE $${params.length}`;
    }

    // Tartiblash
    const allowedSortFields = ['price_seat', 'capacity', 'name'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(baseQuery, params);

    res.status(200).json({
      message: "Tasdiqlangan to‘yxonalar ro‘yxati",
      count: result.rowCount,
      venues: result.rows
    });
  } catch (error) {
    console.error("To‘yxonalarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

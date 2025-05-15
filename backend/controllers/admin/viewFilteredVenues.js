const pool = require('../../config/db');

exports.viewFilteredVenues = async (req, res) => {
  try {
    // Querydan filter va sort parametrlari
    const { sort_by, order, district_id, status, search } = req.query;

    let baseQuery = `SELECT * FROM venues`;
    let conditions = [];
    let values = [];
    let orderClause = '';

    // Filterlar
    if (district_id) {
      values.push(district_id);
      conditions.push(`district_id = $${values.length}`);
    }

    if (status) {
      values.push(status.toLowerCase());
      conditions.push(`LOWER(status) = $${values.length}`);
    }

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      conditions.push(`LOWER(name) LIKE $${values.length}`);
    }

    // WHERE qismi yasash
    if (conditions.length > 0) {
      baseQuery += ` WHERE ` + conditions.join(' AND ');
    }

    // Sort qismi yasash
    const allowedSortFields = ['price_seat', 'capacity'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : null;
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    if (sortField) {
      orderClause = ` ORDER BY ${sortField} ${sortOrder}`;
    }

    // Yakuniy so‘rov
    const finalQuery = baseQuery + orderClause;
    const venues = await pool.query(finalQuery, values);

    res.status(200).json({
      message: "To'yxonalar ro'yxati",
      count: venues.rows.length,
      venues: venues.rows
    });

  } catch (error) {
    console.error("To'yxonalarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

const pool = require('../../config/db');

exports.viewFilteredVenues = async (req, res) => {
  try {
    const { sort, district, status, search } = req.query;
    const userRole = req.user.role;

    let baseQuery = `SELECT * FROM venues`;
    let conditions = [];
    let params = [];
    let orderClause = '';

    // Faqat tasdiqlanganlar user uchun
    if (userRole === 'user') {
      conditions.push(`status = 'tasdiqlangan'`);
    }

    // Saralash
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (district) {
      params.push(district);
      conditions.push(`district_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`LOWER(name) ILIKE LOWER($${params.length})`);
    }

    // WHERE qo‘shamiz, agar conditions mavjud bo‘lsa
    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // Saralash/tartiblash
    if (sort === 'price_asc') {
      orderClause = ' ORDER BY price_seat ASC';
    } else if (sort === 'price_desc') {
      orderClause = ' ORDER BY price_seat DESC';
    } else if (sort === 'capacity_asc') {
      orderClause = ' ORDER BY capacity ASC';
    } else if (sort === 'capacity_desc') {
      orderClause = ' ORDER BY capacity DESC';
    }

    const finalQuery = baseQuery + orderClause;
    const result = await pool.query(finalQuery, params);

    res.status(200).json({ venues: result.rows });

  } catch (error) {
    console.error('Filtrlangan venue larni olishda xatolik:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

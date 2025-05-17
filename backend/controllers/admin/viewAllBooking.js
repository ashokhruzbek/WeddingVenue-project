const pool = require('../../config/db');

exports.viewAllBookings = async (req, res) => {
  try {
    const { sortBy = 'reservation_date', order = 'asc', venue, district, status } = req.query;

    let baseQuery = `
      SELECT 
        b.id AS booking_id,
        v.name AS venue_name,
        d.name AS district_name,
        b.reservation_date,
        b.guest_count,
        b.client_phone,
        u.firstname,
        u.lastname,
        b.status
      FROM bookings b
      JOIN venues v ON b.venue_id = v.id
      JOIN district d ON v.district_id = d.id
      JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (venue) {
      params.push(venue);
      baseQuery += ` AND v.name ILIKE '%' || $${params.length} || '%' `;
    }

    if (district) {
      params.push(district);
      baseQuery += ` AND d.name ILIKE '%' || $${params.length} || '%' `;
    }

    if (status) {
      params.push(status);
      baseQuery += ` AND b.status = $${params.length}`;
    }

    const allowedSort = {
      reservation_date: 'b.reservation_date',
      venue: 'v.name',
      district: 'd.name',
      status: 'b.status'
    };

    const sortColumn = allowedSort[sortBy] || 'b.reservation_date';
    const sortOrder = order  === 'desc' ? 'DESC' : 'ASC';

    baseQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(baseQuery, params);

    res.status(200).json({
      message: "Barcha bronlar",
      bookings: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
  }
};

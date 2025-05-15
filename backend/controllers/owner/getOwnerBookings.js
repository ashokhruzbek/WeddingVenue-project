const pool = require('../../config/db');

exports.viewOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
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
      WHERE v.owner_id = $1
    `;

    const params = [ownerId];

    if (venue) {
      params.push(`%${venue.toLowerCase()}%`);
      baseQuery += ` AND LOWER(v.name) LIKE $${params.length}`;
    }

    if (district) {
      params.push(`%${district.toLowerCase()}%`);
      baseQuery += ` AND LOWER(d.name) LIKE $${params.length}`;
    }

    if (status) {
      params.push(status.toLowerCase());
      baseQuery += ` AND LOWER(b.status) = $${params.length}`;
    }

    const allowedSort = {
      reservation_date: 'b.reservation_date',
      venue: 'v.name',
      district: 'd.name',
      status: 'b.status'
    };

    const sortColumn = allowedSort[sortBy] || 'b.reservation_date';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    baseQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(baseQuery, params);

    res.status(200).json({
      message: "Sizga tegishli bronlar",
      bookings: result.rows
    });
  } catch (error) {
    console.error("Ega bronlarini olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

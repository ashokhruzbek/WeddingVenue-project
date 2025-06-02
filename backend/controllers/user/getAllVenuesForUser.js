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

    // 1. To'yxonalarni olish
    const venuesResult = await pool.query(baseQuery, params);
    const venues = venuesResult.rows;

    if (venues.length === 0) {
      return res.status(200).json({
        message: "To‘yxonalar topilmadi",
        count: 0,
        venues: []
      });
    }

    // 2. To'yxona IDlarini olish
    const venueIds = venues.map(v => v.id);

    // 3. Tegishli rasmlarni olish
    const imagesResult = await pool.query(
      `SELECT id, venue_id, image_url FROM images WHERE venue_id = ANY($1)`,
      [venueIds]
    );
    const images = imagesResult.rows;

    // 4. Har bir venue ga rasmlarni biriktirish va URLni to'liq qilish
    const venuesWithImages = venues.map(venue => ({
      ...venue,
      images: images
        .filter(img => img.venue_id === venue.id)
        .map(img => ({
          id: img.id,
          image_url: `http://localhost:4000/uploads/venues/${img.image_url}`
        }))
    }));

    res.status(200).json({
      message: "Tasdiqlangan to‘yxonalar ro‘yxati",
      count: venuesWithImages.length,
      venues: venuesWithImages
    });
  } catch (error) {
    console.error("To‘yxonalarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const pool = require("../../config/db");

exports.viewAllVenues = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // SELECT qism, rasm URL'larini to'liq qilish bilan
    const selectClause = `
      v.*,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', i.id,
              'image_url', 
                CASE 
                  WHEN i.image_url IS NOT NULL AND i.image_url != '' 
                  THEN CONCAT('http://localhost:4000/uploads/venues/', i.image_url)
                  ELSE NULL
                END
            ) ORDER BY i.id
          )
          FROM images i
          WHERE i.venue_id = v.id
        ), '[]'::json
      ) AS images
    `;

    let baseQuery = "";
    let countQuery = "";
    let queryParams = [];
    let countParams = [];

    if (userRole === "admin") {
      baseQuery = `FROM venues v ORDER BY v.id DESC`;
      countQuery = `SELECT COUNT(*) AS total FROM venues v`;
    } else if (userRole === "owner") {
      baseQuery = `FROM venues v WHERE v.owner_id = $1 ORDER BY v.id DESC`;
      countQuery = `SELECT COUNT(*) AS total FROM venues v WHERE v.owner_id = $1`;
      queryParams.push(userId);
      countParams.push(userId);
    } else {
      return res.status(403).json({ message: "Sizga ruxsat yo‘q" });
    }

    // Umumiy yozuvlar soni
    const totalResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(totalResult.rows[0].total);
    const totalPages = Math.ceil(totalCount / limit);

    // Limit va offset parametrlari
    const paginatedQueryParams = [...queryParams, limit, offset];

    // To‘liq so‘rov
    const dataQueryString = `SELECT ${selectClause} ${baseQuery} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    const result = await pool.query(dataQueryString, paginatedQueryParams);

    // Javobni to‘g‘ridan-to‘g‘ri ishlatamiz, rasm URL’lari allaqachon tayyor
    const venues = result.rows.map((venue) => ({
      ...venue,
      images: Array.isArray(venue.images) ? venue.images : [],
    }));

    res.status(200).json({
      message: "To'yxonalar ro'yxati",
      venues: venues,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("❌ Venue ko‘rsatishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

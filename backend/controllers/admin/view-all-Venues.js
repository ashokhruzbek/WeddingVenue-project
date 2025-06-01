const pool = require("../../config/db");

exports.viewAllVenues = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const offset = (page - 1) * limit;

    // Rasm URLlarini to'liq qilib qaytaruvchi funksiya
    const buildVenueResponse = (rows) => {
      return rows.map((venue) => {
        return {
          ...venue,
          images: Array.isArray(venue.images) && venue.images.length > 0
            ? venue.images.map(
                (img) => ({
                  id: img.id,
                  image_url: img.image_url // Assuming image_url from DB is already full or handled by subquery
                })
              )
            : [],
        };
      });
    };

    let baseQuery = "";
    let countQuery = "";
    let queryParams = [];
    let countParams = [];

    const selectClause = `
      v.*,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', i.id,
              'image_url', CASE 
                             WHEN i.image_url IS NOT NULL AND i.image_url != '' THEN CONCAT('http://localhost:4000/uploads/venues/', i.image_url)
                             ELSE NULL
                           END
            ) ORDER BY i.id
          )
          FROM images i
          WHERE i.venue_id = v.id
        ), '[]'::json
      ) AS images
    `;

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

    // Get total count for pagination
    const totalResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(totalResult.rows[0].total);
    const totalPages = Math.ceil(totalCount / limit);

    // Add LIMIT and OFFSET for pagination to queryParams
    // The order of params in queryParams should match the order of $ placeholders
    const paginatedQueryParams = [...queryParams];
    if (userRole === "admin") {
      paginatedQueryParams.push(limit, offset);
    } else if (userRole === "owner") {
      // userId is $1, limit will be $2, offset will be $3
      paginatedQueryParams.push(limit, offset);
    }
    
    const dataQueryString = `SELECT ${selectClause} ${baseQuery} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    
    const result = await pool.query(dataQueryString, paginatedQueryParams);

    const venuesWithFullImageURLs = buildVenueResponse(result.rows);

    res.status(200).json({
      message: "To'yxonalar ro'yxati",
      venues: venuesWithFullImageURLs,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("❌ Venue ko‘rsatishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const pool = require("../../config/db");

exports.viewAllVenues = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    console.log("✅ Foydalanuvchi roli:", userRole);
    console.log("✅ Foydalanuvchi ID:", userId);

    let query = "";
    let params = [];

    // Rasm URLlarini to'liq qilib qaytaruvchi funksiya
    const buildVenueResponse = (rows) => {
      return rows.map((venue) => {
        return {
          ...venue,
          images: Array.isArray(venue.images) && venue.images.length > 0
            ? venue.images.map(
                (img) => ({
                  id: img.id,
                  image_url: `http://localhost:4000/uploads/${img.image_url}`
                })
              )
            : [],
        };
      });
    };

    if (userRole === "admin") {
      query = `
        SELECT 
          v.*,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', i.id,
                  'image_url', i.image_url
                )
              )
              FROM images i
              WHERE i.venue_id = v.id
            ), '[]'::json
          ) AS images
        FROM venues v
        ORDER BY v.id DESC
      `;
    } else if (userRole === "owner") {
      query = `
        SELECT 
          v.*,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', i.id,
                  'image_url', i.image_url
                )
              )
              FROM images i
              WHERE i.venue_id = v.id
            ), '[]'::json
          ) AS images
        FROM venues v
        WHERE v.owner_id = $1
        ORDER BY v.id DESC
      `;
      params = [userId];
    } else {
      return res.status(403).json({ message: "Sizga ruxsat yo‘q" });
    }

    const result = await pool.query(query, params);

    console.log("✅ Qaytgan venue soni:", result.rowCount);
    console.log("🔁 Birinchi venue:", result.rows[0]);

    const venuesWithFullImageURLs = buildVenueResponse(result.rows);

    res.status(200).json({
      message: "To'yxonalar ro'yxati",
      count: result.rowCount,
      venues: venuesWithFullImageURLs,
    });
  } catch (error) {
    console.error("❌ Venue ko‘rsatishda xatolik:", error.message);
    res.status(500).json({ message: "Server xatosi" });
  }
};

const pool = require("../config/db");

exports.viewVenues = async (req, res) => {
  try {
    // Barcha to'yxonalarni olish
    const venuesResult = await pool.query("SELECT * FROM venues");
    const venues = venuesResult.rows;

    // Barcha venues id larini olish
    const venueIds = venues.map((v) => v.id);

    // Barcha rasmlarni olish (agar venueIds bo‘lsa)
    let images = [];
    if (venueIds.length > 0) {
      const imagesResult = await pool.query(
        "SELECT * FROM images WHERE venue_id = ANY($1)",
        [venueIds]
      );
      images = imagesResult.rows;
    }

    // Rasmlarni venuesga biriktirish va to‘liq URL qilish
    const venuesWithImages = venues.map((venue) => ({
      ...venue,
      images: images
        .filter((img) => img.venue_id === venue.id)
        .map((img) => ({
          id: img.id,
          image_url: `http://13.51.241.247/uploads/${img.image_url}`,
        })),
    }));

    res.status(200).json({
      message: "Barcha to'yxonalar ro'yxati",
      count: venuesWithImages.length,
      venues: venuesWithImages,
    });
  } catch (error) {
    console.error("To'yxonalarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

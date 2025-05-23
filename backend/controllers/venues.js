const pool = require("../config/db");


exports.viewVenues = async (req, res) => {
  try {
    // Barcha to'yxonalarni olamiz
    const venuesResult = await pool.query('SELECT * FROM venues');
    const venues = venuesResult.rows;

    // Hamma venues id larini olamiz
    const venueIds = venues.map(v => v.id);

    // Hamma rasmlarni olamiz
    let images = [];
    if (venueIds.length) {
      const imagesResult = await pool.query(
        'SELECT * FROM images WHERE venue_id = ANY($1)',
        [venueIds]
      );
      images = imagesResult.rows;
    }

    // Rasmlarni venuesga biriktiramiz
    const venuesWithImages = venues.map(venue => ({
      ...venue,
      images: images
        .filter(img => img.venue_id === venue.id)
        .map(img => img.image_url)
    }));

    res.status(200).json({
      message: "Barcha to'yxonalar ro'yxati",
      count: venuesWithImages.length,
      venues: venuesWithImages
    });
  } catch (error) {
    console.error("To'yxonalarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

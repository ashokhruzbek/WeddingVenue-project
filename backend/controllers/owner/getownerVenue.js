const pool = require("../../config/db");

exports.getAllVenues = async (req, res) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(400).json({ 
        message: "Foydalanuvchi ID topilmadi",
        success: false
      });
    }

    // 1. Ownerga tegishli to'yxonalarni olish
    const venuesResult = await pool.query(
      `SELECT id, name, address, capacity, price_seat, phone_number FROM venues
       WHERE owner_id = $1
      `,
      [ownerId]
    );

    const venues = venuesResult.rows;

    if (venues.length === 0) {
      return res.status(200).json({ 
        message: "Sizga tegishli to'yxonalar topilmadi",
        venues: [],
        success: false
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

    // 4. Rasm URLlarini to‘liq qilib biriktirish
    const venuesWithImages = venues.map(venue => ({
      ...venue,
      images: images
        .filter(img => img.venue_id === venue.id)
        .map(img => ({
          id: img.id,
          image_url: `http://localhost:4000/uploads/venues/${img.image_url}`
        }))
    }));

    return res.status(200).json({
      message: "To'yxonalar muvaffaqiyatli olindi",
      venues: venuesWithImages,
      success: true
    });

  } catch (error) {
    console.error("Venue olishda xatolik:", error);
    return res.status(500).json({ 
      message: "Serverda xatolik yuz berdi",
      success: false
    });
  }
};

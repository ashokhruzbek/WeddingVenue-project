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

    const result = await pool.query(
      `SELECT id, name, address, capacity, price_seat, phone_number FROM venues
       WHERE owner_id = $1
        `,
      [ownerId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "Sizga tegishli to'yxonalar topilmadi",
        venues: [],
        success: false
      });
    }

    return res.status(200).json({
      message: "To'yxonalar muvaffaqiyatli olindi",
      venues: result.rows,
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

 
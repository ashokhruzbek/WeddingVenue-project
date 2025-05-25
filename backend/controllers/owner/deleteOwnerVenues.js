const pool = require("../../config/db");

exports.deleteOwnerVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const ownerId = JSON.parse(localStorage.getItem("user"))?.id;

    console.log("venueId:", venueId);
    console.log("ownerId:", ownerId);

    if (!ownerId) {
      return res.status(400).json({
        message: "Foydalanuvchi ID topilmadi",
        success: false,
      });
    }

    // Venue mavjudligini tekshiramiz
    const venueResult = await pool.query(
      "SELECT * FROM venues WHERE id = $1 AND owner_id = $2",
      [venueId, ownerId]
    );

    if (venueResult.rows.length === 0) {
      return res.status(404).json({
        message: "To'yxona topilmadi yoki sizga tegishli emas",
        success: false,
      });
    }

    // Venue ni o'chiramiz
    await pool.query("DELETE FROM venues WHERE id = $1", [venueId]);

    return res.status(200).json({
      message: "To'yxona muvaffaqiyatli o'chirildi",
      success: true,
    });
  } catch (error) {
    console.error("Venue o'chirishda xatolik:", error);
    return res.status(500).json({
      message: "Serverda xatolik yuz berdi",
      success: false,
    });
  }
};

const pool = require('../../config/db');

exports.approveVenue = async (req, res) => {
  try {
    const venueId = req.params.id;

    // 1. Venue mavjudligini tekshirish
    const venueResult = await pool.query('SELECT * FROM venues WHERE id = $1', [venueId]);
    if (venueResult.rows.length === 0) {
      return res.status(404).json({ message: "To'yxona topilmadi" });
    }

    // 2. Status allaqachon "tasdiqlangan" bo‘lsa, ortiqcha tasdiqlash shart emas
    if (venueResult.rows[0].status === 'tasdiqlangan') {
      return res.status(400).json({ message: "Bu to'yxona allaqachon tasdiqlangan" });
    }

    // 3. Yangilash: Statusni "tasdiqlangan" qilish
    const updateResult = await pool.query(
      `UPDATE venues SET status = 'tasdiqlangan' WHERE id = $1 RETURNING *`,
      [venueId]
    );

    res.status(200).json({
      message: "To'yxona muvaffaqiyatli tasdiqlandi",
      venue: updateResult.rows[0]
    });

  } catch (error) {
    console.error("To'yxonani tasdiqlashda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

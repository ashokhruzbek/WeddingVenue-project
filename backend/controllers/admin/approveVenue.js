const pool = require('../../config/db');

exports.approveVenue = async (req, res) => {
	try {
		const venueId = req.params.id;

		const result = await pool.query(
			`UPDATE venues SET status = 'tasdiqlangan' WHERE id = $1 RETURNING *`,
			[venueId]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ message: "To'yxona topilmadi" });
		}

		res.status(200).json({ message: "To'yxona tasdiqlandi", data: result.rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
	}
};

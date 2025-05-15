const pool = require('../../config/db');

exports.viewAllOwners = async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT id, firstname, lastname, username, role
			FROM users
			WHERE role = 'owner'
			ORDER BY id
		`);

		res.status(200).json({
			message: "Barcha to'yxona egalari",
			owners: result.rows
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
	}
};

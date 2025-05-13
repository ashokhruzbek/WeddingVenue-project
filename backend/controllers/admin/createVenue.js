const pool = require('../../config/db');

exports. createVenue = async (req, res) => {
    try {
        const { name, district_id, address, capacity, price_seat, phone_number } = req.body;

        const owner_id = req.user.id; // token orqali user ID olamiz
        const userRole = req.user.role;

        // Faqat owner yoki admin yarata oladi
        if (userRole !== 'owner' && userRole !== 'admin') {
            return res.status(403).json({ message: 'Ruxsat etilmagan' });
        }

        // Venue yaratish
        const result = await pool.query(
            `INSERT INTO venues (name, district_id, address, capacity, price_seat, phone_number, status, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [ name, district_id, address, capacity, price_seat, phone_number,
                userRole === 'admin' ? 'tasdiqlangan' : 'tasdiqlanmagan', owner_id
            ]
        );

        res.status(201).json({ message: 'To‘yxona yaratildi', venue: result.rows[0] });
    } catch (error) {
        console.error('Venue yaratishda xatolik:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};


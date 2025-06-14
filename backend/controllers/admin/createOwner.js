const pool = require('../../config/db');
const bcrypt = require('bcrypt');

exports.createOwner = async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body;

        // 1. Kiritilgan qiymatlar to‘liq bo‘lishini tekshirish
        if (!firstname || !lastname || !username || !password) {
            return res.status(400).json({ message: 'Barcha maydonlar to‘ldirilishi shart' });
        }

        // 2. Username mavjudligini tekshirish
        const userExists = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Bu username allaqachon mavjud' });
        }

        // 3. Parolni bcrypt bilan hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Owner foydalanuvchisini yaratish
        const result = await pool.query(
            `INSERT INTO users (firstname, lastname, username, password, role)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [firstname, lastname, username, hashedPassword, 'owner']
        );

        res.status(201).json({
            message: "Yangi owner yaratildi",
            owner: result.rows[0]
        });

    } catch (error) {
        console.error("Owner yaratishda xatolik:", error.message);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
};

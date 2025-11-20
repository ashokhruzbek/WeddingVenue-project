const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validatsiya
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Foydalanuvchi nomi va parol kiritilishi shart" 
      });
    }

    // 2. Foydalanuvchini topish
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: "Foydalanuvchi nomi yoki parol noto'g'ri" 
      });
    }

    const user = result.rows[0];

    // 3. Parolni tekshirish
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ 
        message: "Foydalanuvchi nomi yoki parol noto'g'ri" 
      });
    }

    // 4. Token yaratish
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    // 5. Muvaffaqiyatli javob
    res.status(200).json({
      message: "Tizimga kirish muvaffaqiyatli",
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server xatosi", 
      error: err.message 
    });
  }
};

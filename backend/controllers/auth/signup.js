const pool = require("../../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();


exports.signup = async (req, res) => {
  const { firstname, lastname, username, password, role } = req.body;

  try {
    // 1. Validatsiya
    if (!firstname || !lastname || !username || !password || !role) {
      return res.status(400).json({ 
        message: "Barcha maydonlar to'ldirilishi shart" 
      });
    }

    // 2. Rol tekshiruvi
    const allowedRoles = ['admin', 'owner', 'user'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Noto'g'ri rol tanlandi" 
      });
    }

    // 3. Parol uzunligi tekshiruvi
    if (password.length < 4) {
      return res.status(400).json({ 
        message: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" 
      });
    }

    // 4. Username mavjudligini tekshirish
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        message: "Bu foydalanuvchi nomi allaqachon band" 
      });
    }

    // 5. Parolni hashlash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Yangi foydalanuvchi yaratish
    const newUser = await pool.query(
      `INSERT INTO users 
        (firstname, lastname, username, password, role)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, firstname, lastname, username, role`,
      [firstname, lastname, username, hashedPassword, role]
    );

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
      user: newUser.rows[0]
    });
  } catch (err) {
    // Database unique constraint xatosi
    if (err.code === '23505') {
      return res.status(409).json({ 
        message: "Bu foydalanuvchi nomi allaqachon band" 
      });
    }
    
    res.status(500).json({ 
      message: "Server xatosi", 
      error: err.message 
    });
  }
};

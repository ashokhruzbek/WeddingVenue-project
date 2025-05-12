const pool = require("../../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();


exports.signup = async (req, res) => {
  const { firstname, lastname, username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users 
        (firstname, lastname, username, password, role)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
      [firstname, lastname, username, hashedPassword, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Signup xatosi:", err.message);
    res.status(500).send(err.message || "Server xatosi!");
  }
};

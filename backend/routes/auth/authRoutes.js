const express = require("express");
const authRoutes = express.Router();
const { login } = require("../../controllers/auth/login");
const { signup } = require("../../controllers/auth/signup");


authRoutes.post("/login", login);
authRoutes.post("/signup", signup )


module.exports = authRoutes;

const express = require("express");
const { login } = require("../controllers/auth/login");
const { signup } = require("../controllers/auth/signup");


const authRoutes = express.Router();
authRoutes.post("/login", login);
authRoutes.post("/signup", signup)


module.exports = authRoutes;

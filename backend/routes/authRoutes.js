const express = require("express");
const { login } = require("../controllers/auth/login");


const authRoutes = express.Router();
authRoutes.post("/login", login);


module.exports = authRoutes;

const express = require("express");
const { checkRole } = require("../middlewares/checkRole");
const adminRoute = express.Router();

adminRoute.use(checkRole(["admin"]));
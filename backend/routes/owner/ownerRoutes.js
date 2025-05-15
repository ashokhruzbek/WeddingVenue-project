const express = require("express");
const { checkRole } = require("../../middlewares/checkRole");
const { authentication } = require("../../middlewares/authentication");
const { cancelBooking } = require("../../controllers/owner/cancelBooking");
const ownerRouter = express.Router();

ownerRouter.use( authentication, checkRole(['owner']))

ownerRouter.delete('/cancel-booking/:id', cancelBooking)


module.exports = ownerRouter;
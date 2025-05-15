const express = require("express");
const { checkRole } = require("../../middlewares/checkRole");
const { authentication } = require("../../middlewares/authentication");
const { cancelBooking } = require("../../controllers/owner/cancelBooking");
const { registerVenueByOwner } = require("../../controllers/owner/registerVenueByOwner");
const { updateVenueOwner } = require("../../controllers/owner/updateVenueOwner");
const { viewOwnerBookings } = require("../../controllers/owner/getOwnerBookings");
const { addBooking } = require("../../controllers/owner/addBooking");
const ownerRouter = express.Router();

ownerRouter.use( authentication, checkRole(['owner']))

ownerRouter.delete('/cancel-booking/:id', cancelBooking)
ownerRouter.post('/reg-owner', registerVenueByOwner)
ownerRouter.put('/update-owner/:id', updateVenueOwner)
ownerRouter.get('/get-owner-bookings', viewOwnerBookings)
ownerRouter.post('/add-booking', addBooking)


module.exports = ownerRouter;
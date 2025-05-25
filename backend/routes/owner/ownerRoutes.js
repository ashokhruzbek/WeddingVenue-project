const express = require("express");
const { checkRole } = require("../../middlewares/checkRole");
const { authentication } = require("../../middlewares/authentication");
const { cancelBooking } = require("../../controllers/owner/cancelBooking");
const { registerVenueByOwner } = require("../../controllers/owner/registerVenueByOwner");
const { updateVenueOwner } = require("../../controllers/owner/updateVenueOwner");
const { addBooking } = require("../../controllers/owner/addBooking");
const { getVenueBookings } = require("../../controllers/owner/getVenueBookings");
const { getAllVenues } = require("../../controllers/owner/getownerVenue");
const { deleteOwnerVenue } = require("../../controllers/owner/deleteOwnerVenues");
const ownerRouter = express.Router();

ownerRouter.use( authentication, checkRole(['owner']))

ownerRouter.delete('/cancel-booking/:id', cancelBooking)
ownerRouter.post('/reg-owner',  registerVenueByOwner)
ownerRouter.put('/update-owner/:id', updateVenueOwner)
ownerRouter.post('/add-booking', addBooking)
ownerRouter.get('/view-venue-booking/:id', getVenueBookings)
ownerRouter.get('/view-owner-venue/:id', getAllVenues);
ownerRouter.delete('/delete-owner-venue/:id', deleteOwnerVenue);


module.exports = ownerRouter;
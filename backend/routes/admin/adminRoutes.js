const express = require("express");
const adminRouter = express.Router();
const { assignOwner } = require("../../controllers/admin/assignOwner");
const { updateVenue } = require("../../controllers/admin/updateVenue");
const { checkRole } = require("../../middlewares/checkRole");
const { createOwner } = require("../../controllers/admin/createOwner");
const { deleteVenue } = require("../../controllers/admin/deleteVenue");
const { viewAllVenues } = require("../../controllers/admin/view-all-Venues");
const { viewFilteredVenues } = require("../../controllers/admin/viewFilteredVenues");
const { getSingleVenue } = require("../../controllers/admin/singleVenue");
const { approveVenue } = require("../../controllers/admin/approveVenue");
const { authentication } = require("../../middlewares/authentication");
const { viewAllOwners } = require("../../controllers/admin/viewAllOwners");
const { viewAllBookings } = require("../../controllers/admin/viewAllBooking");
const { cancelBooking } = require("../../controllers/admin/cancelBooking");
const { createVenue } = require("../../controllers/admin/createVenue");

adminRouter.use(authentication, checkRole(["admin"]));

adminRouter.post("/assign-owner", assignOwner);
adminRouter.post('/create-venue', createVenue )
adminRouter.put("/update-venue/:id", updateVenue);
adminRouter.post("/create-owner", createOwner);
adminRouter.delete("/delete-venue/:id", deleteVenue);
adminRouter.get("/view-all-venues", viewAllVenues);
adminRouter.get("/venues", viewFilteredVenues);
adminRouter.get("/get-single-venue/:id", getSingleVenue);
adminRouter.put("/approve-venue/:id", approveVenue);
adminRouter.get('/owners', viewAllOwners);
adminRouter.get('/view-all-bookings', viewAllBookings)
adminRouter.delete('/cancel-booking/:id', cancelBooking);


module.exports = adminRouter;

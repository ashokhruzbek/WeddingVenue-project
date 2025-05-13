const express = require('express');
const adminRouter = express.Router();
const { authentication } = require('../../middlewares/authentication');
const { assignOwner } = require('../../controllers/admin/assignOwner');
const { createVenue } = require('../../controllers/admin/createVenue');
const { updateVenue } = require('../../controllers/admin/updateVenue');
const { checkRole } = require('../../middlewares/checkRole');
const { createOwner } = require('../../controllers/admin/createOwner');
const { deleteVenue } = require('../../controllers/admin/deleteVenue');
const { viewAllVenues } = require('../../controllers/admin/view-all-Venues');
const { viewFilteredVenues } = require('../../controllers/admin/viewFilteredVenues');

// adminRouter.use(checkRole(['admin']))

adminRouter.post('/assign-owner', assignOwner);
adminRouter.post('/create-venue', authentication,  createVenue )
adminRouter.put('/update-venue/:id',  updateVenue)
adminRouter.post('/create-owner', createOwner)
adminRouter.delete('/delete-venue/:id', deleteVenue)
adminRouter.get('/view-all-venues', authentication, viewAllVenues)
adminRouter.get('/venues', authentication, viewFilteredVenues)

module.exports = adminRouter;

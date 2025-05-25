const express = require('express');
const userRouter = express.Router();
const { authentication } = require('../../middlewares/authentication');
const { checkRole } = require('../../middlewares/checkRole');
const { addBooking } = require('../../controllers/user/addBooking');
const { cancelBooking } = require('../../controllers/user/cancelBooking');
const { getAllVenuesForUser } = require('../../controllers/user/getAllVenuesForUser');
const { getUserBookings } = require('../../controllers/user/getUserBookings');
const { getAvailableDates } = require('../../controllers/user/getAvailableDates');

userRouter.use( authentication, checkRole(['user']))

userRouter.delete('/cancel-booking/:id', cancelBooking )
userRouter.post('/add-booking/:id', addBooking )
userRouter.get('/get-venues-user', getAllVenuesForUser)
userRouter.get('/get-user-booking/:id', getUserBookings)
userRouter.get('/get-available-dates', getAvailableDates)


module.exports = userRouter;
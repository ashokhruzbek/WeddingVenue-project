const express = require('express');
const userRouter = express.Router();
const { authentication } = require('../../middlewares/authentication');
const { checkRole } = require('../../middlewares/checkRole');
const { addBooking } = require('../../controllers/user/addBooking');
const { cancelBooking } = require('../../controllers/user/cancelBooking');

userRouter.use( authentication, checkRole(['user']))

userRouter.delete('/cancel-booking/:id', cancelBooking )
userRouter.post('/add-booking', addBooking )


module.exports = userRouter;
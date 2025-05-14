const express = require('express');
const userRouter = express.Router();
const { addBooking } = require('../../controllers/user/addBooking');
const { authentication } = require('../../middlewares/authentication');
const { checkRole } = require('../../middlewares/checkRole');

userRouter.use(checkRole(['user']))

userRouter.post('/add-booking',authentication, addBooking)


module.exports = userRouter;
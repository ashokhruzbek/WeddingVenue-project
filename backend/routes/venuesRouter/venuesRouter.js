const express = require('express');
const { viewVenues } = require('../../controllers/venues');

const venueRouter = express.Router();

venueRouter.get('/venues', viewVenues);

module.exports = venueRouter;

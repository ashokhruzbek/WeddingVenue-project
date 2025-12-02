const express = require('express');
const { viewVenues } = require('../../controllers/venues');

const venueRouter = express.Router();

// /api/venues da ishlaydi (server.js da prefix qo'shilgan)
venueRouter.get('/', viewVenues);

module.exports = venueRouter;

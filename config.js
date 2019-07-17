'use strict';
require('dotenv').config();

exports.GOOGLEMAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
exports.WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
exports.ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;
exports.TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;

exports.PORT = process.env.PORT || 8080;
const express = require('express');
const fetch = require('node-fetch');

const {
  GOOGLEMAPS_API_KEY,
  TICKETMASTER_API_KEY,
  WEATHERBIT_API_KEY,
  ZOMATO_API_KEY
} = require('./config');

const router = express.Router();

router.get('/geocode', async (req, res) => {
  const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  const query = req.url.split('?')[1];
  const queryStr = `?key=${GOOGLEMAPS_API_KEY}&${query}`;

  const options = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  };

  try {
    let resp = await fetch(GEOCODE_URL + queryStr, options);
    let data = await resp.json();
    
    return res.status(resp.status).json(data);
  }
  catch (err) {

    return res.status(500).json({error: error.message});
  }
});

router.get('/zomato', async (req, res) => {
  const ZOMATO_URL = 'https://developers.zomato.com/api/v2.1/locations?';
  const queryStr = req.url.split('?')[1];

  const options = {
    method: 'GET',
    headers: {
    'user-key': ZOMATO_API_KEY +'0',
    'Accept' : 'application/json'
    }
  }

  try {
    let resp = await fetch(ZOMATO_URL + queryStr, options);
    let data = await resp.json();
    
    return res.status(resp.status).json(data);
  } catch(err) {

    return res.status(500).json({message: err.message});
  }

});

module.exports = router;
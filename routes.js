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
    
    if (data.status !== 'OK') {
      throw {
        reason: 'apiErr', 
        status: resp.status, 
        message: data.error_message
      };
    }
    
    return res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    if (err.reason === 'apiErr') {
      return res.status(err.status).json({message: err.message});
    }

    return res.status(500).json({error: error.message});
  }
});

module.exports = router;
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
  } catch (err) {

    return res.status(500).json({error: error.message});
  }
});

router.get('/weatherbit', async (req, res) => {
  const WEATHERBIT_URL = 'https://api.weatherbit.io/v2.0/current?';
  const query = req.url.split('?')[1];
  const queryStr = `${query}&key=${WEATHERBIT_API_KEY}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    let resp = await fetch(WEATHERBIT_URL + queryStr, options);
    let data = await resp.json();

    return res.status(resp.status).json(data);
  } catch (err) {
    console.log(err);
    return status(500).json(err);
  }
});

router.get('/zomato', async (req, res) => {
  const ZOMATO_URL = 'https://developers.zomato.com/api/v2.1/locations?';
  const queryStr = req.url.split('?')[1];

  const options = {
    method: 'GET',
    headers: {
    'user-key': ZOMATO_API_KEY,
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

router.get('/zomato/details', async (req, res) => {
  const ZOMATO_URL = 'https://developers.zomato.com/api/v2.1/location_details?'
  const queryStr = req.url.split('?')[1];

  const options = {
    method: 'GET',
    headers: {
    'user-key': ZOMATO_API_KEY,
    'Accept' : 'application/json'
    }
  }
  try {
    let resp = await fetch(ZOMATO_URL + queryStr, options);
    let data = await resp.json();
    
    return res.status(resp.status).json(data);
  } catch(err) {

    console.log(err);
    return res.status(500).json({message: err.message});
  }
});

module.exports = router;
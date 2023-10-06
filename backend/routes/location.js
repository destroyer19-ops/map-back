const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { IPinfoWrapper } = require("node-ipinfo");

// Create a new location
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    
    // Create a new location document
    const location = new Location({ name, latitude, longitude });
    
    // Save the location to the database
    await location.save();
    
    res.status(201).json({ message: 'Location added successfully', location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add location' });
  }
});
// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});


router.get('/user-location', async (req, res) => {
  try {
    const ipinfo = new IPinfoWrapper("884d2612505be2");

    // Replace 'user_ip' with the actual user's IP address, which you can obtain from the request object
    const userIp = req.ip;
    console.log(userIp); // Assuming you have middleware to set req.ip

    const locationInfo = await ipinfo.lookupIp(userIp);
    res.json(locationInfo);
  } catch (error) {
    console.error('Error getting user location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

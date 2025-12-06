const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

router.get('/bookings', async (req, res) => {
  try {
    const all = await Booking.find({}).lean();
    res.json(all || []);
  } catch (err) {
    console.error('Admin bookings error:', err);
    res.status(500).json({ error: 'Unable to fetch bookings' });
  }
});

router.get('/kpis', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({});
    const totalListings = await Listing.countDocuments({});
    res.json({ totalBookings, totalListings });
  } catch (err) {
    console.error('KPIs error:', err);
    res.status(500).json({ error: 'Unable to compute KPIs' });
  }
});

module.exports = router;

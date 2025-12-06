const express = require('express');
const router = express.Router();
const Attraction = require('../models/Attraction');

// GET all attractions
router.get('/', async (req, res) => {
  try {
    const all = await Attraction.find({}).lean();
    res.json(all || []);
  } catch (err) {
    console.error('Attractions error:', err);
    res.status(500).json({ error: 'Unable to fetch attractions' });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const Attraction = require('../models/Attraction');
  router.post('/generate', async (req, res) => {
    try {
      const { days = 1, preferences = [] } = req.body;

      // load attractions from Mongo
      const all = await Attraction.find({}).lean() || [];

      const results = [];

      for (let i = 1; i <= days; i++) {
        const slots = [];

        preferences.forEach((pref) => {
          const matches = all.filter((a) =>
            (a.category || '').toLowerCase().includes((pref || '').toLowerCase())
          );

          if (matches.length > 0) {
            const pick = matches[i % matches.length];
            slots.push({
              time: `${9 + slots.length * 2}:00 - ${11 + slots.length * 2}:00`,
              title: pick.name,
              desc: `Visit ${pick.name}, a popular ${pick.category} attraction.`,
              lat: pick.lat,
              lon: pick.lon,
              img: pick.img
            });
          }
        });

        // fallback if no matching attraction for preference
        if (slots.length === 0 && all.length > 0) {
          const pick = all[i % all.length];
          slots.push({
            time: '10:00 - 12:00',
            title: pick.name,
            desc: `Explore ${pick.name}.`,
            lat: pick.lat,
            lon: pick.lon,
            img: pick.img
          });
        }

        results.push({ day: i, title: `Day ${i}`, slots });
      }

      res.json({ days: results });
    } catch (err) {
      console.log('Itinerary Error:', err);
      res.status(500).json({ error: 'Unable to generate itinerary' });
    }
  });

  return router;

module.exports = router;

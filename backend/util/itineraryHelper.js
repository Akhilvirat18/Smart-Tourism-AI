function scorePlace(place, prefs, origin) {
  let score = place.rating * 10;

  if (prefs.includes(place.category)) score += 20;

  if (origin) {
    const d = Math.sqrt(
      Math.pow(place.lat - origin.lat, 2) + Math.pow(place.lon - origin.lon, 2)
    );
    score += Math.max(0, 10 - d * 5);
  }

  return score;
}

function generateItinerary(attractions, opts) {
  const { days, preferences, lat, lon } = opts;
  const origin = { lat, lon };

  const scored = attractions.map(a => ({
    ...a,
    score: scorePlace(a, preferences, origin)
  }));

  scored.sort((a, b) => b.score - a.score);

  const perDay = Math.ceil(scored.length / days);

  const itinerary = [];

  for (let d = 0; d < days; d++) {
    itinerary.push({
      day: d + 1,
      items: scored.slice(d * perDay, (d + 1) * perDay)
    });
  }

  return itinerary;
}

module.exports = { generateItinerary };

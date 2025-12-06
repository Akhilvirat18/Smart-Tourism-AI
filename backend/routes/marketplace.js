const { nanoid } = require('nanoid');
const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Helper to compute average rating for a listing
function computeAvgRating(listingId, reviews) {
  const r = (reviews || []).filter(x => x.listingId === listingId);
  if (!r.length) return null;
  const avg = r.reduce((s, it) => s + (it.rating || 0), 0) / r.length;
  return Math.round(avg * 10) / 10; // one decimal place
}

// GET all items (include avgRating)
router.get('/listings', async (req, res) => {
  try {
    const [listings, reviews] = await Promise.all([
      Listing.find({}).lean(),
      Review.find({}).lean()
    ]);

    const enriched = (listings || []).map(item => ({
      ...item,
      avgRating: computeAvgRating(item.id, reviews),
      reviewCount: (reviews || []).filter(r => r.listingId === item.id).length
    }));
    res.json(enriched);
  } catch (err) {
    console.error('Listings fetch error:', err);
    res.status(500).json({ error: 'Unable to fetch listings' });
  }
});

// GET reviews for a listing
router.get('/listings/:id/reviews', async (req, res) => {
  try {
    const id = req.params.id;
    const reviews = await Review.find({ listingId: id }).lean();
    res.json(reviews || []);
  } catch (err) {
    console.error('Reviews fetch error:', err);
    res.status(500).json({ error: 'Unable to fetch reviews' });
  }
});

// POST a review for a listing
// body: { user: "username", rating: 4, text: "Nice product" }
router.post('/listings/:id/reviews', async (req, res) => {
  try {
    const id = req.params.id;
    const { user = 'guest', rating = 5, text = '' } = req.body;

    // Basic validation
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be 1..5' });
    }

    const review = new Review({
      id: nanoid(8),
      listingId: id,
      user,
      rating: Number(rating),
      text,
      createdAt: new Date()
    });

    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Unable to create review' });
  }
});

// POST buy endpoint
router.post('/buy', async (req, res) => {
  try {
    const { listingId, qty = 1, buyer = 'u1' } = req.body;
    const item = await Listing.findOne({ id: listingId });
    if (!item) return res.json({ error: 'Item not found' });

    if ((item.stock || 0) < qty) return res.json({ error: 'Out of stock' });

    item.stock = (item.stock || 0) - qty;
    await item.save();

    const order = new Booking({
      id: nanoid(8),
      listingId,
      qty,
      buyer,
      createdAt: new Date()
    });
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ error: 'Unable to complete purchase' });
  }
});

// GET all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({}).lean();
    const listings = await Listing.find({}).lean();
    const enriched = (bookings || []).map(booking => ({
      ...booking,
      userName: booking.buyer || 'Guest User',
      itemTitle: listings.find(l => l.id === booking.listingId)?.title || 'Unknown Attraction',
      totalPrice: booking.totalPrice || (booking.qty || 1) * 85,
      status: booking.status || 'pending'
    }));
    res.json(enriched);
  } catch (err) {
    console.error('Bookings fetch error:', err);
    res.status(500).json({ error: 'Unable to fetch bookings' });
  }
});

// PUT update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = status || 'pending';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Unable to update booking' });
  }
});

// PUT update listing
router.put('/listings/:id', async (req, res) => {
  try {
    const { title, category, price } = req.body;
    const listing = await Listing.findOne({ id: req.params.id });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (title) listing.title = title;
    if (category) listing.category = category;
    if (price !== undefined) listing.price = price;
    await listing.save();
    res.json({ success: true, listing });
  } catch (err) {
    console.error('Update listing error:', err);
    res.status(500).json({ error: 'Unable to update listing' });
  }
});

// DELETE listing
router.delete('/listings/:id', async (req, res) => {
  try {
    const deleted = await Listing.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Listing not found' });
    console.log('Deleted listing:', deleted);
    res.json({ success: true, deleted });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

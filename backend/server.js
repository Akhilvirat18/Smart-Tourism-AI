// server.js (replace your existing file with this)
require('dotenv').config(); // Load .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ========== MONGODB CONNECTION ==========
const MONGODB_URI = process.env.MONGODB_URI;
let mongoConnected = false;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    mongoConnected = true;
    console.log('✅ MongoDB connected');
    seedMongoDB(); // Seed data if connected
  })
  .catch((err) => {
    console.warn('⚠️  MongoDB connection failed, using fallback:', err.message);
  });
}

// ========== LOWDB SETUP (FALLBACK) ==========
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);

const defaultData = {
  attractions: [],
  providers: [],
  listings: [],
  bookings: [],
  users: []
};

const db = new Low(adapter, defaultData);

async function initDB() {
  await db.read();
  db.data = db.data || defaultData;

  if (!db.data.attractions || db.data.attractions.length === 0) {
    db.data.attractions = [
      { 
        id: 'a1', name: 'Sun Temple', category: 'heritage', lat: 23.4, lon: 85.5, 
        duration_mins: 120, rating: 4.6, 
        img: 'https://images.pexels.com/photos/6133440/pexels-photo-6133440.jpeg?auto=compress&cs=tinysrgb&w=800' 
      },
      { 
        id: 'a2', name: 'Dassam Falls', category: 'nature', lat: 23.2, lon: 85.6, 
        duration_mins: 90, rating: 4.8, 
        img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' 
      },
      { 
        id: 'a3', name: 'Patratu Valley', category: 'nature', lat: 23.7, lon: 85.0, 
        duration_mins: 150, rating: 4.7, 
        img: 'https://superbcollections.com/wp-content/uploads/2023/08/me4.png' 
      },
      { 
        id: 'a4', name: 'Hillview Fort', category: 'heritage', lat: 23.52, lon: 85.45, 
        duration_mins: 100, rating: 4.4, 
        img: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66' 
      }
    ];

    db.data.listings = [
    { id: 'l1', title: 'Handmade Scented Candle', price: 299, provider: 'p1', stock: 10, img: 'https://images.pexels.com/photos/4599547/pexels-photo-4599547.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'l2', title: 'Jute Handbag', price: 650, provider: 'p2', stock: 6, img: 'https://images.pexels.com/photos/1036077/pexels-photo-1036077.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'l3', title: 'Organic Soap Pack', price: 199, provider: 'p1', stock: 15, img: 'https://images.pexels.com/photos/3947477/pexels-photo-3947477.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'l4', title: 'Pure Forest Honey', price: 450, provider: 'p3', stock: 8, img: 'https://images.pexels.com/photos/2772594/pexels-photo-2772594.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'l5', title: 'Aroma Diffuser Set', price: 899, provider: 'p2', stock: 5, img: 'https://images.pexels.com/photos/3953535/pexels-photo-3953535.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'l6', title: 'Eco-Friendly Travel Kit', price: 499, provider: 'p1', stock: 12, img: 'https://images.pexels.com/photos/1020054/pexels-photo-1020054.jpeg?auto=compress&cs=tinysrgb&w=600' }
];

    db.data.providers = [
      { id: 'p1', name: 'Tribal Handicrafts', verified: true },
      { id: 'p2', name: 'Clay Artisans', verified: false }
    ];

    db.data.users = [
      { id: 'u1', name: 'demoUser', role: 'user' },
      { id: 'admin', name: 'Administrator', role: 'admin' }
    ];

    await db.write();
  }
}

initDB();

// ========== SEED MONGODB ==========
async function seedMongoDB() {
  try {
    const Attraction = require('./models/Attraction');
    const Listing = require('./models/Listing');
    
    // Check if attractions already exist
    const count = await Attraction.countDocuments();
    if (count === 0) {
      const attractions = [
        { id: 'a1', name: 'Sun Temple', category: 'heritage', lat: 23.4, lon: 85.5, duration_mins: 120, rating: 4.6, img: 'https://images.pexels.com/photos/6133440/pexels-photo-6133440.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'a2', name: 'Dassam Falls', category: 'nature', lat: 23.2, lon: 85.6, duration_mins: 90, rating: 4.8, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
        { id: 'a3', name: 'Patratu Valley', category: 'nature', lat: 23.7, lon: 85.0, duration_mins: 150, rating: 4.7, img: 'https://superbcollections.com/wp-content/uploads/2023/08/me4.png' },
        { id: 'a4', name: 'Hillview Fort', category: 'heritage', lat: 23.52, lon: 85.45, duration_mins: 100, rating: 4.4, img: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66' }
      ];
      await Attraction.insertMany(attractions);
      console.log('📍 Attractions seeded to MongoDB');
    }

    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      const listings = [
        { id: 'l1', title: 'Handmade Scented Candle', price: 299, provider: 'p1', stock: 10, img: 'https://cdn.pixabay.com/photo/2020/12/03/17/30/candles-5800400_1280.jpg' },
        { id: 'l2', title: 'Jute Handbag', price: 650, provider: 'p2', stock: 6, img: 'https://cdn.pixabay.com/photo/2016/11/29/10/16/bag-1866583_1280.jpg' },
        { id: 'l3', title: 'Organic Soap Pack', price: 199, provider: 'p1', stock: 15, img: 'https://cdn.pixabay.com/photo/2015/09/09/20/04/soap-932704_1280.jpg' },
        { id: 'l4', title: 'Pure Forest Honey', price: 450, provider: 'p3', stock: 8, img: 'https://cdn.pixabay.com/photo/2015/03/03/18/58/honey-657512_1280.jpg' },
        { id: 'l5', title: 'Aroma Diffuser Set', price: 899, provider: 'p2', stock: 5, img: 'https://cdn.pixabay.com/photo/2017/07/30/18/31/aromatherapy-2558294_1280.jpg' },
        { id: 'l6', title: 'Eco-Friendly Travel Kit', price: 499, provider: 'p1', stock: 12, img: 'https://cdn.pixabay.com/photo/2017/01/04/12/41/travel-1955557_1280.jpg' }
      ];
      await Listing.insertMany(listings);
      console.log('🛍️  Listings seeded to MongoDB');
    }
  } catch (err) {
    console.warn('Seeding error (non-critical):', err.message);
  }
}

// ========== ROUTES ==========
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// Helper: get data from MongoDB or fallback to lowdb
async function getAttractions() {
  if (mongoConnected) {
    try {
      const Attraction = require('./models/Attraction');
      return await Attraction.find({}).lean();
    } catch (err) {
      console.warn('MongoDB query failed, using lowdb:', err.message);
    }
  }
  return db.data.attractions || [];
}

async function getListings() {
  if (mongoConnected) {
    try {
      const Listing = require('./models/Listing');
      return await Listing.find({}).lean();
    } catch (err) {
      console.warn('MongoDB query failed, using lowdb:', err.message);
    }
  }
  return db.data.listings || [];
}

// GET all attractions
app.get('/api/attractions', async (req, res) => {
  try {
    const attractions = await getAttractions();
    res.json(attractions);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch attractions' });
  }
});

// GET single attraction
app.get('/api/attractions/:id', async (req, res) => {
  try {
    const attractions = await getAttractions();
    const attraction = attractions.find(a => a.id === req.params.id);
    if (!attraction) return res.status(404).json({ error: 'Not found' });
    res.json(attraction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST generate itinerary
app.post('/api/itinerary/generate', async (req, res) => {
  try {
    const { days = 1, preferences = [] } = req.body;
    const attractions = await getAttractions();
    const results = [];

    for (let i = 1; i <= days; i++) {
      const slots = [];

      preferences.forEach((pref) => {
        const matches = attractions.filter((a) =>
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

      if (slots.length === 0 && attractions.length > 0) {
        const pick = attractions[i % attractions.length];
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
    res.status(500).json({ error: 'Unable to generate itinerary' });
  }
});

// GET all marketplace listings
app.get('/api/marketplace/listings', async (req, res) => {
  try {
    const listings = await getListings();
    const enriched = listings.map(item => ({
      ...item,
      avgRating: 4.5,
      reviewCount: Math.floor(Math.random() * 50)
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch listings' });
  }
});

// GET single listing
app.get('/api/marketplace/listings/:id', async (req, res) => {
  try {
    const listings = await getListings();
    const listing = listings.find(l => l.id === req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    res.json({ ...listing, avgRating: 4.5, reviews: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add to cart
app.post('/api/marketplace/cart', (req, res) => {
  res.json({ success: true, cartId: 'cart-1' });
});

// GET admin bookings
app.get('/api/admin/bookings', async (req, res) => {
  try {
    // Return mock bookings for now
    const mockBookings = [
      { id: 'b1', userName: 'Alice Johnson', itemTitle: 'Sun Temple', totalPrice: 120, status: 'completed', date: new Date() },
      { id: 'b2', userName: 'Bob Smith', itemTitle: 'Dassam Falls', totalPrice: 85, status: 'pending', date: new Date() },
      { id: 'b3', userName: 'Carol Williams', itemTitle: 'Patratu Valley', totalPrice: 95, status: 'completed', date: new Date() },
      { id: 'b4', userName: 'David Brown', itemTitle: 'Jute Handbag', totalPrice: 650, status: 'completed', date: new Date() },
      { id: 'b5', userName: 'Eve Davis', itemTitle: 'Organic Soap Pack', totalPrice: 199, status: 'pending', date: new Date() }
    ];
    res.json(mockBookings);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch bookings' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

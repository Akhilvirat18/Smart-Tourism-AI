const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_EXPIRY = '7d';

// In-memory user store (fallback if MongoDB is not available)
const inMemoryUsers = {};

// Helper function: try to save/find users in MongoDB if available, else fallback to in-memory
let User;
try {
  User = require('../models/User');
} catch (err) {
  User = null;
}

async function findUserByEmail(email) {
  if (User) {
    try {
      return await User.findOne({ email }).lean();
    } catch (err) {
      console.warn('MongoDB findOne failed, falling back to in-memory:', err.message);
    }
  }
  return Object.values(inMemoryUsers).find(u => u.email === email);
}

async function createUser(id, name, email, passwordHash) {
  if (User) {
    try {
      const user = new User({ id, name, email, passwordHash, role: 'user' });
      await user.save();
      return user.toObject();
    } catch (err) {
      console.warn('MongoDB save failed, storing in-memory:', err.message);
    }
  }
  const user = { id, name, email, passwordHash, role: 'user' };
  inMemoryUsers[id] = user;
  return user;
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    // check existing
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userId = nanoid(8);
    const user = await createUser(userId, name || email.split('@')[0], email, hash);

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Unable to signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Unable to login' });
  }
});

module.exports = router;

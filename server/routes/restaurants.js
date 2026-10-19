const express = require('express');
const Restaurant = require('../models/Restaurant');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

const SORTABLE = ['name', 'cuisine', 'rating', 'createdAt'];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Next numeric restaurant_id as a string ("31" after "30").
async function nextRestaurantId() {
  const docs = await Restaurant.find({}, 'restaurant_id').lean();
  const max = docs.reduce((m, d) => {
    const n = parseInt(d.restaurant_id, 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return String(max + 1);
}

// Shared list logic: search, cuisine filter, sort and paging all happen on the server.
async function listRestaurants(req, res, baseFilter) {
  try {
    const { q, cuisine, sort = 'name', order = 'asc' } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);

    const filter = { ...baseFilter };

    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ name: rx }, { cuisine: rx }, { address: rx }];
    }
    if (cuisine) {
      filter.cuisine = new RegExp(`^${escapeRegex(cuisine)}$`, 'i');
    }

    const sortField = SORTABLE.includes(sort) ? sort : 'name';
    const sortOrder = order === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([
      Restaurant.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit),
      Restaurant.countDocuments(filter)
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---------- Public (read only) ---------- */

// GET /api/restaurants
router.get('/', (req, res) => listRestaurants(req, res, { status: 'approved' }));

// GET /api/restaurants/cuisines
router.get('/cuisines', async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct('cuisine', { status: 'approved' });
    res.json(cuisines.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------- Admin (requires a valid login token) ---------- */

// GET /api/restaurants/admin/all
router.get('/admin/all', requireAdmin, (req, res) => listRestaurants(req, res, {}));

// POST /api/restaurants  (add)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, cuisine, address, rating, contact } = req.body;
    const created = await Restaurant.create({
      restaurant_id: req.body.restaurant_id || (await nextRestaurantId()),
      name,
      cuisine,
      address,
      rating,
      contact
    });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'That restaurant_id already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/restaurants/:restaurantId  (edit)
router.put('/:restaurantId', requireAdmin, async (req, res) => {
  try {
    const { name, cuisine, address, rating, contact } = req.body;
    const updated = await Restaurant.findOneAndUpdate(
      { restaurant_id: req.params.restaurantId },
      { $set: { name, cuisine, address, rating, contact } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/restaurants/:restaurantId  (delete)
router.delete('/:restaurantId', requireAdmin, async (req, res) => {
  try {
    const deleted = await Restaurant.findOneAndDelete({
      restaurant_id: req.params.restaurantId
    });
    if (!deleted) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/restaurants/:restaurantId  (keep last so it does not catch other GET routes)
router.get('/:restaurantId', async (req, res) => {
  try {
    const item = await Restaurant.findOne({ restaurant_id: req.params.restaurantId });
    if (!item) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
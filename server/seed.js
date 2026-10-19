// Usage: put your 30-restaurant JSON file at server/data/restaurants.json, then run: npm run seed
// Warning: this clears the restaurants collection before inserting.
require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const data = require('./data/restaurants.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Restaurant.deleteMany({});
    await Restaurant.syncIndexes();
    const inserted = await Restaurant.insertMany(data);
    console.log(`Seeded ${inserted.length} restaurants`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
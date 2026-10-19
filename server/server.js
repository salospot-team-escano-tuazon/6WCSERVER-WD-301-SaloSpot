require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurants');
const authRoutes = require('./routes/auth');

const missingEnv = !process.env.MONGODB_URI || !process.env.JWT_SECRET;
if (missingEnv) {
  console.error('Missing MONGODB_URI or JWT_SECRET in the environment.');
  // Locally, stop right away. On a host, keep loading so requests get a clear error.
  if (require.main === module) process.exit(1);
}

const app = express();

// The app sits behind a proxy on Vercel, so use the real client IP for rate limiting.
app.set('trust proxy', 1);

app.use(cors(process.env.CLIENT_URL ? { origin: process.env.CLIENT_URL } : undefined));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'SaloSpot' });
});

// Connect on demand and reuse the connection. Serverless hosts start the app
// per request, so the database cannot be connected only once at startup.
let connecting = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .finally(() => {
        connecting = null;
      });
  }
  await connecting;
}

app.use(async (req, res, next) => {
  if (missingEnv) return res.status(500).json({ message: 'Server is not configured' });
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    res.status(503).json({ message: 'Database unavailable. Try again shortly.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Keeps errors (such as bad JSON bodies) as JSON instead of HTML pages.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: status === 500 ? 'Server error' : err.message });
});

// Run a normal server only when started directly (npm run dev / npm start).
// On Vercel the exported app is used instead.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`SaloSpot API running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
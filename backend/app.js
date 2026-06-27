const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  // On Vercel / Production - use Atlas only
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log('MongoDB Connected (Atlas)');
      isConnected = true;
      return;
    } catch (err) {
      console.log('Atlas connection failed:', err.message);
    }
  }

  // Local development - try local MongoDB
  try {
    console.log('Trying local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/sweetcrumb', { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected (Local) - Data will persist!');
    isConnected = true;
    return;
  } catch (err) {
    console.log('Local MongoDB not available');
  }

  // Fallback to Memory Server (local dev only)
  try {
    process.env.MONGOMS_DOWNLOAD_DIR = 'D:\\mongodb-binaries';
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create({
      binary: { version: '6.0.4' }
    });
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log('MongoDB Connected (In-Memory)');
    isConnected = true;
  } catch (err) {
    console.error('Failed to start MongoDB:', err.message);
    process.exit(1);
  }
}

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Sweet Crumb API Running' });
});

// Export app for Vercel
module.exports = app;

// For local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

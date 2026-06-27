const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

process.env.MONGOMS_DOWNLOAD_DIR = 'D:\\mongodb-binaries';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  // Try local MongoDB first (persistent data!)
  try {
    console.log('Trying local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/sweetcrumb', { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected (Local) - Data will persist!');
    isConnected = true;
    return;
  } catch (err) {
    console.log('Local MongoDB not available');
  }

  // Try Atlas
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const directUri = uri.replace('mongodb+srv://', 'mongodb://');
    const uris = [uri, directUri];
    
    for (const tryUri of uris) {
      try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(tryUri, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB Connected (Atlas)');
        isConnected = true;
        return;
      } catch (err) {
        console.log('Atlas attempt failed:', err.message);
      }
    }
  }

  // Fallback to Memory Server (NOT persistent)
  if (!process.env.FIREBASE_FUNCTION) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('Starting in-memory MongoDB... (Data will NOT persist!)');
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
  res.json({ message: 'Sweet Crumb Bakery API Running' });
});

// For local development
const PORT = process.env.PORT || 5000;
if (!process.env.FIREBASE_FUNCTION) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// Export for Firebase Cloud Functions
const functions = require('firebase-functions');
exports.api = functions.https.onRequest(app);

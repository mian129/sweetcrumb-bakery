const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

process.env.MONGOMS_DOWNLOAD_DIR = 'D:\\mongodb-binaries';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  
  // Try Atlas first
  if (uri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(uri);
      console.log('MongoDB Connected (Atlas)');
      return;
    } catch (err) {
      console.log('Atlas connection failed:', err.message);
    }
  }

  // Fallback to local MongoDB
  try {
    console.log('Trying local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/sweetcrumb');
    console.log('MongoDB Connected (Local)');
    return;
  } catch (err) {
    console.log('Local MongoDB not available');
  }

  // Fallback to Memory Server
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create({
      binary: { version: '6.0.4' }
    });
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log('MongoDB Connected (In-Memory)');
    console.log('Database is ready for use!');
  } catch (err) {
    console.error('Failed to start MongoDB:', err.message);
    console.error('Please install MongoDB locally or fix your Atlas connection');
    process.exit(1);
  }
}

connectDB().then(() => {
  // Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/upload', require('./routes/upload'));

  // Health Check
  app.get('/', (req, res) => {
    res.json({ message: 'Sweet Crumb Bakery API Running' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Vercel optimized)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found!');
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false
    }).then((mongoose) => mongoose);
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('MongoDB Connected');
    return cached.conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    cached.promise = null;
    return null;
  }
}

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

// Vercel serverless handler
module.exports = app;

const app = require('../app');
const mongoose = require('mongoose');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('MongoDB Connected (Vercel)');
      } catch (err) {
        console.error('MongoDB connection failed:', err.message);
      }
    }
  }
  return app(req, res);
};

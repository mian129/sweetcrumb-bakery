const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  deliveryCharges: {
    type: Number,
    default: 50
  },
  bankName: {
    type: String,
    default: ''
  },
  accountTitle: {
    type: String,
    default: ''
  },
  accountNumber: {
    type: String,
    default: ''
  },
  iban: {
    type: String,
    default: ''
  },
  branchCode: {
    type: String,
    default: ''
  },
  bankInstructions: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

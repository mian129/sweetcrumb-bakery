const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Get settings (public - for frontend to get delivery charges and bank details)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings (admin only)
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    const { deliveryCharges, bankName, accountTitle, accountNumber, iban, branchCode, bankInstructions } = req.body;
    
    if (deliveryCharges !== undefined) settings.deliveryCharges = deliveryCharges;
    if (bankName !== undefined) settings.bankName = bankName;
    if (accountTitle !== undefined) settings.accountTitle = accountTitle;
    if (accountNumber !== undefined) settings.accountNumber = accountNumber;
    if (iban !== undefined) settings.iban = iban;
    if (branchCode !== undefined) settings.branchCode = branchCode;
    if (bankInstructions !== undefined) settings.bankInstructions = bankInstructions;
    
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

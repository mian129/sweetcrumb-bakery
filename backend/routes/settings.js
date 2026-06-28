const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');
const { snakeToCamel } = require('../utils/helpers');

router.get('/', async (req, res) => {
  try {
    let { data: settings } = await supabase.from('settings').select('*').limit(1).single();

    if (!settings) {
      const { data: created } = await supabase.from('settings').insert({}).select().single();
      settings = created;
    }

    res.json(snakeToCamel(settings));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    let { data: settings } = await supabase.from('settings').select('*').limit(1).single();

    if (!settings) {
      const { data: created } = await supabase.from('settings').insert({}).select().single();
      settings = created;
    }

    const { deliveryCharges, bankName, accountTitle, accountNumber, iban, branchCode, bankInstructions } = req.body;

    const updates = {};
    if (deliveryCharges !== undefined) updates.delivery_charges = deliveryCharges;
    if (bankName !== undefined) updates.bank_name = bankName;
    if (accountTitle !== undefined) updates.account_title = accountTitle;
    if (accountNumber !== undefined) updates.account_number = accountNumber;
    if (iban !== undefined) updates.iban = iban;
    if (branchCode !== undefined) updates.branch_code = branchCode;
    if (bankInstructions !== undefined) updates.bank_instructions = bankInstructions;
    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase.from('settings').update(updates).eq('id', settings.id).select().single();
    if (error) throw error;

    res.json(snakeToCamel(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

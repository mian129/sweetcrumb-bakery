const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');
const { snakeToCamel } = require('../utils/helpers');

router.get('/', async (req, res) => {
  try {
    let { data: settings } = await supabase.from('settings').select('*').order('updated_at', { ascending: false }).limit(1).single();

    if (!settings) {
      const { data: created } = await supabase.from('settings').insert({}).select().single();
      settings = created;
    }

    const camel = snakeToCamel(settings);

    // Parse bankAccounts from bank_instructions if it's JSON
    if (camel.bankInstructions) {
      try {
        const parsed = JSON.parse(camel.bankInstructions);
        if (parsed._bankAccounts) {
          camel.bankAccounts = parsed._bankAccounts;
          camel.bankInstructions = parsed._bankInstructions || '';
        }
      } catch (e) {
        // Not JSON, keep as is
      }
    }

    if (!camel.bankAccounts) {
      camel.bankAccounts = [];
      if (camel.bankName || camel.accountNumber) {
        camel.bankAccounts = [{
          bankName: camel.bankName || '',
          accountTitle: camel.accountTitle || '',
          accountNumber: camel.accountNumber || '',
          iban: camel.iban || '',
          branchCode: camel.branchCode || ''
        }];
      }
    }

    res.json(camel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    let { data: settings } = await supabase.from('settings').select('*').order('updated_at', { ascending: false }).limit(1).single();

    if (!settings) {
      const { data: created } = await supabase.from('settings').insert({}).select().single();
      settings = created;
    }

    const { deliveryCharges, bankName, accountTitle, accountNumber, iban, branchCode, bankInstructions, bankAccounts } = req.body;

    const updates = {};
    if (deliveryCharges !== undefined) updates.delivery_charges = deliveryCharges;

    // Store bankAccounts and bankInstructions together in bank_instructions as JSON
    if (bankAccounts !== undefined) {
      updates.bank_instructions = JSON.stringify({ _bankAccounts: bankAccounts, _bankInstructions: bankInstructions || '' });
    } else {
      if (bankInstructions !== undefined) {
        // Just updating instructions text, keep existing bank accounts
        let existing = {};
        try { existing = JSON.parse(settings.bank_instructions || '{}'); } catch(e) {}
        updates.bank_instructions = JSON.stringify({ _bankAccounts: existing._bankAccounts || [], _bankInstructions: bankInstructions });
      }
    }

    // Also update legacy fields with first account for backward compatibility
    if (bankAccounts && bankAccounts.length > 0) {
      const first = bankAccounts[0];
      if (first.bankName !== undefined) updates.bank_name = first.bankName;
      if (first.accountTitle !== undefined) updates.account_title = first.accountTitle;
      if (first.accountNumber !== undefined) updates.account_number = first.accountNumber;
      if (first.iban !== undefined) updates.iban = first.iban;
      if (first.branchCode !== undefined) updates.branch_code = first.branchCode;
    } else {
      if (bankName !== undefined) updates.bank_name = bankName;
      if (accountTitle !== undefined) updates.account_title = accountTitle;
      if (accountNumber !== undefined) updates.account_number = accountNumber;
      if (iban !== undefined) updates.iban = iban;
      if (branchCode !== undefined) updates.branch_code = branchCode;
    }

    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase.from('settings').update(updates).eq('id', settings.id).select().single();
    if (error) throw error;

    res.json(snakeToCamel(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');
const protect = require('../middleware/authMiddleware');
const getBalance = require("../utils/balanceCalculator");

// GET: Fetch all transactions
router.get('/',protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;

const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');
const protect = require('../middleware/authMiddleware');
const getBalance = require("../utils/balanceCalculator");
// POST: Add a new transaction
router.post('/',protect, async (req, res) => {
  try {
    // Attach userId from authenticated user
    const transaction = new Transaction({
      ...req.body,
      userId: req.user._id
    });

    await transaction.save();

    // Calculate updated balance
    const balance = await getBalance(req.user._id);

    res.status(201).json({
      message: "Transaction added",
      transaction,
      updatedBalance: balance
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
    


// GET: Fetch all transactions
router.get('/',protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE: delete a transaction
router.delete('/:id',protect, async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT: update a transaction
router.put('/:id',protect, async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

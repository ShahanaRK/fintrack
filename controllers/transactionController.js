const Transaction = require('../models/transactionModel');



// Get all transactions of the logged-in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTransactions,
};

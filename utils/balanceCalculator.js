// utils/balanceCalculator.js
const mongoose = require("mongoose");
const Transaction = require("../models/transactionModel");

async function getBalance(userId) {
  const totals = await Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$type", // "income" or "expense"
        total: { $sum: "$amount" }
      }
    }
  ]);

  let income = 0;
  let expense = 0;

  for (const t of totals) {
    if (t._id === "income") income = t.total;
    else if (t._id === "expense") expense = t.total;
  }

  return income - expense;
}

module.exports = getBalance;

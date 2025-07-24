const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ['short-term', 'mid-term', 'long-term'],
    required: true,
  },

  category: {
    type: String,
    enum: ['savings', 'investment', 'purchase', 'debt', 'other'],
    default: 'savings',
  },

  description: {
    type: String,
    maxlength: 500,
  },

  targetAmount: {
    type: Number,
    required: true,
  },

  savedAmount: {
    type: Number,
    default: 0,
  },

  monthlyContribution: {
    type: Number,
    default: 0, // optional but useful for automation or projections
  },

  targetDate: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isRecurring: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ['in-progress', 'completed', 'cancelled'],
    default: 'in-progress',
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },

  linkedTransactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
});

module.exports = mongoose.model('Goal', goalSchema);
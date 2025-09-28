//registration
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minlength: [5, 'Name must be at least 5 characters long'],
    maxlength: [30, 'Name cannot exceed 30 characters']
  },
  phone: {
    type: String,
    unique: true,
    required: [true, 'phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    validate: {
      validator: function(v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/.test(v);
      },
      message: props => 'Password must contain at least one letter, one number, and one special character'
    }
  },
  age: {
    type: Number,
    required: true,
    min: [0, 'Age must be a positive number'],
    max: [100, 'Age seems unrealistic']
  },
  familySize: {
    type: Number,
    required: true,
    min: [1, 'Family must have at least 1 member']
  },
  earningMembers: {
    type: Number,
    required: [true, 'Number of earning members is required'],
    min: [0, 'Earning members cannot be negative'],
    validate: {
      validator: function (value) {
        return value <= this.familySize;
      },
      message: 'Earning members cannot exceed family size'
    }
  },
 
  fixedExpenses: {
    type: Number,
    required: true,
    min: [0, 'Fixed expenses cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.monthlyIncome;
      },
      message: 'Fixed expenses cannot exceed monthly income'
    }
  },
  variableExpenseRange: {
  type: String,
  enum: ["0-15000", "15001-30000", "30001-50000", "50001-75000", "75001-100000", "100001-150000", "150001+"],
  required: true,
},
points: {
    type: Number,
    default: 0,
  },

  badges: 
    {
      name: String,
      description: String,
      achievedOn: Date
    },


  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, { timestamps: true });


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);

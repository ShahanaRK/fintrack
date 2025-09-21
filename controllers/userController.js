const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Login existing user
const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await userModel.findOne({ phone });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ message: "Account locked. Try again later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      }

      await user.save();
      return res.status(401).send("Invalid Credentials");
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

// Register new user
const registerController = async (req, res) => {
  try {
    const { name, phone, password, age, familySize, earningMembers, monthlyIncome, fixedExpenses } = req.body;

    if (!name || !phone || !password || !age || !familySize || !earningMembers || !monthlyIncome || !fixedExpenses) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await userModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json("User already exists");
    }

    const newUser = new userModel({ name, phone, password, age, familySize, earningMembers, monthlyIncome, fixedExpenses });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Something went wrong" });
  }
};

// Delete logged-in user account
const deleteController = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ id: user._id, name: user.name, phone: user.phone });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginController, registerController, deleteController, getProfile };

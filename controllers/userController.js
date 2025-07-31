const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const generateToken = require('../utils/generateToken');
//login
const loginController = async(req,res) => {
    try {
        const {phone,password}=req.body
        const user = await userModel.findOne({ phone });
        if(!user){
            return res.status(404).send("User Not Found")

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Credentials");
        }

        const token = generateToken(user._id); 

        res.status(200).json({
            success:true,
            user,
            token,
        })
        
    } catch (error) {
        res.status(400).json({
            success:false,
            error
        })
        
    }
}
//register
const registerController = async(req,res) => {
    try {
        const { name, phone, password, age, familySize, earningMembers, monthlyIncome, fixedExpenses } = req.body;
     
        if(!name|| !phone|| !password|| !age|| !familySize|| !earningMembers|| !monthlyIncome|| !fixedExpenses )
        {
           return res.status(400).send("All fields are required");
        }
        const existingUser = await userModel.findOne({ phone });
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        
        const newUser = new userModel({ name, phone, password,age, familySize, earningMembers, monthlyIncome, fixedExpenses  });

        await newUser.save();

        const token = generateToken(newUser._id);       
        res.status(201).json({
            success: true,
            user: newUser,
            token,
        });
        
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({
            success:false,
            message: error.message || "Something went wrong",
        })
        
    }
}
// DELETE: Delete a user by ID
const deleteController= async (req, res) => {
  try {
    const userId = req.params.id
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// @desc   Get user profile
// @route  GET /api/v1/users/profile
// @access Private
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {loginController,registerController,deleteController,getProfile};
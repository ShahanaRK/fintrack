const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
//login
const loginController = async(req,res) => {
    try {
        const {name,password}=req.body
        const user = await userModel.findOne({name})
        if(!user){
            return res.status(404).send("User Not Found")

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Credentials");
        }

        res.status(200).json({
            success:true,
            user,
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
        const { name, phone, password } = req.body;

        const existingUser = await userModel.findOne({ phone });
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, phone, password: hashedPassword });

        await newUser.save();
        res.status(201).json({
            success: true,
            user: newUser,
        });
        
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({
            success:false,
            message: error.message || "Something went wrong",
        })
        
    }
}
module.exports = {loginController,registerController}
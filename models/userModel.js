//registration
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    phone:{
        type:String,
        unique:true,
        required:[true,'phone number is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    }
},
    { timestamps:true})
    //hashed password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
    
});

const userModel = mongoose.model('users',userSchema)
module.exports=userModel;
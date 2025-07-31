//registration
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        minlength: [5, 'Name must be at least 5 characters long'],
        maxlength: [30, 'Name cannot exceed 30 characters']
    },
    phone:{
        type:String,
        unique:true,
        required:[true,'phone number is required'],
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minlength: [6, 'Password must be at least 6 characters long'] 
    },
    age: {
        type:Number,
        required: true,
        min: [0, 'Age must be a positive number'],
        max: [100, 'Age seems unrealistic']
    },
    familySize:
    {
        type:Number,
        required: true,
        min: [1, 'Family must have at least 1 member']

    },
    earningMembers:
    {
        type:Number,
        required:[true,'Number of earning members is required'],
        min: [0, 'Earning members cannot be negative'],
        validate: {
            validator: function (value) {
                return value <= this.familySize;
            },
            message: 'Earning members cannot exceed family size'
        }
    },
    monthlyIncome:
    {
        type: Number,
        required: [true, 'Monthly income is required'],
        min: [0, 'Monthly income cannot be negative']
    },
    fixedExpenses:
    {
        type: Number,
        required: [true,'Fixed expenses are required'],
        min: [0, 'Fixed expenses cannot be negative'],
        validate: {
            validator: function (value) {
                return value <= this.monthlyIncome;
            },
            message: 'Fixed expenses cannot exceed monthly income'
        }
    }
      
    
},
    

    { timestamps:true});
    //hashed password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
    
});

const userModel = mongoose.model('users',userSchema)
module.exports=userModel;
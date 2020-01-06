const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const Expense =  require('./expense');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },    
    avatar:{
        type:Buffer
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Email is invalid")
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("age must be a positive number")
            }
        }
    },

    tokens: [{
        token:
        {
            type: String,
            require: true
        }
    }],
    resetPasswordToken : {
        require:false,
        trim:true,
        type:String
    },
    resetPasswordExpires:{
        require:false,
        type:Date
    } 
},{
    timestamps:true
})


userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.virtual('expenses',{
    ref:'Expense',
    localField:'_id',
    foreignField:'owner'

})
userSchema.pre("save", async function (next) {
    const user = this;
    console.log("inside presave ")
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

userSchema.pre('remove',async function(next){

    const user = this;
    await Task.deleteMany({owner:user._id});
    await Expense.deleteMany({owner:user._id});
    next();
})


userSchema.methods.toJSON = async function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
userSchema.statics.findUserByEmailAndPassword = async function (email, password) {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;

}
const User = mongoose.model('User', userSchema)

module.exports = User;
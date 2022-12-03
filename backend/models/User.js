const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    firstName:{
        required:[true,'First name is required'],
        type: String
    },
    lastName:{
        required:[true,'Last name is required'],
        type: String
    },
    email:{
        required:[true,'Email is required'],
        type: String
    },
    password:{
        type: String,
        required: [true,'Password is required']
    },
    isAccountVerified:{
        type: Boolean,
        default: false
    },
    isAccountActivated:{
        type: Boolean,
        default: true,
        
    },
  
    isAdmin:{
        type: Boolean,
        default: false,
        // required: [true,'isAdmin is required']
    },
    isSuperAdmin:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum: ['SuperAdmin','Admin','User']
    },
},
{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals: true
    },
    timestamps: true
})

userSchema.pre('save', async function (next){
    if(!this.isModified("password")){
        next()
    }
    var salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.isPasswordMatched = async function (enteredPassowrd){
    return await bcrypt.compare(enteredPassowrd, this.password)
}

const User = mongoose.model('User',userSchema)

module.exports = User

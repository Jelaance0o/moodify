const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true ,  'Username is required' ],
        unique: true  
    },
    email:{
        type:String,
        required:[true , 'Email is must'],
        unique:true 
    },
    password:{
        type:String,
        required:[true , 'password is required'],
        select:false
    }
})
userSchema.pre("save", function(next){})
userSchema.post("save", function(next){})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;
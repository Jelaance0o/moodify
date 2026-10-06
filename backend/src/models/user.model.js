const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:[true ,  'Username is required' ],
        unique:[true ,  'Username must unique' ]
    },
    email:{
        type:String,
        require:[true , 'Email is must'],
        unique:[true , 'email must be uniqe']
    },
    password:{
        type:String,
        require:[true , 'password is required']
    }
})
userSchema.pre("save", function(next){})
userSchema.post("save", function(next){})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;
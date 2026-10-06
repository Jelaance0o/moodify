const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req,res) {
  const { username, email, password } = req.body;

  isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isAlreadyRegistered) {
    return res.status(400).json({
        message: " user already exist"
    })
  }
  const hash = await bcrypt.hash(password , 10)

  const user = await userModel.create({
    username,
    email,
    password:hash
  })
  const token = jwt.sign({
    id:user._id,
    username : user.username},
    process.env.JWT_SECRET ,{
        expiresIn:"3d"
    })

    res.cookie("token" , token)

    return res.status(201).json({
        message:"user",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}

async function loginUser(req,res) {
    const { email , username  , password} = req.body
    const user = userModel.findOne({
        $or:[{email},{username}]
    })
    if(!user){
        return res.status(401).json({
            message: 'Invalid credentials'
        })
    }

    isPasswordValid = await bcrypt.compare(password ,user.password)
    
    if(!isPassword){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    },env.process.JWT_SECRET,{
        expiresIn:"3d"
    })
    res.cookie("token",token)

    return res.status(201).json({
        message:"user login..!!bn",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }, 
    })

}

module.exports = {
  registerUser,loginUser
};

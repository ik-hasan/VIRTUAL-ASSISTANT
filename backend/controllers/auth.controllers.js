const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const genToken = require('../config/token');

const signUp = async (req,res)=>{
  try {

    const {name,email,password} = req.body;



    const existEmail = await User.findOne({email}); 
    if(existEmail){
      return res.status(400).json({
        message:"Email already exist"
      })
    }



    if(password.length<6){
      return res.status(400).json({
        message:"*Password must be at least 6 Characters"
      })
    }
    const hashedPassword = await bcrypt.hash(password,10);


    const user = await User.create({name,email,password:hashedPassword});




    const token = await genToken(user._id);
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"strict",
      secure:false
    })



    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({
      message:`sign up error ${error}`
    })
  }
}




const Login = async (req,res)=>{
  try {

    const {email,password} = req.body;



    const user = await User.findOne({email}); 
    if(!user){
      return res.status(400).json({
        message:"Email not exist Please Sign up"
      })
    }


    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({
        message:"incorrect password"
      })
    }


    const token = await genToken(user._id);
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"strict",
      secure:false
    })



    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message:`login error ${error}`
    })
  }
}





const logOut = async(req,res)=>{
  try {
    // res.clearCookie("token");
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    return res.status(200).json({
      message:`logout successfully`
    })
  } catch (error) {
    return res.status(500).json({
      message:`logout error ${error}`
    })
  }
}

module.exports = {signUp,Login,logOut}
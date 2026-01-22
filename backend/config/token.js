const jwt = require('jsonwebtoken')
require("dotenv").config();
const genToken = async (userId)=>{
  try {
    const token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"10d"});

    return token;
  } catch (error) {
    console.log("Token generation error",error);
  }
}

module.exports = genToken
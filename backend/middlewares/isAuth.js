const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = async (req,res,next)=>{
  try {
    const token = req.cookies.token;
    if(!token){
      return res.status(400).json({
        message:"Token not found"
      })
    }

    const verifyToken = await jwt.verify(token,process.env.JWT_SECRET)
    req.userId = verifyToken.userId

    next()
  } catch (error) {
    console.log("Token authentication error",error);
    return res.status(400).json({
      message:"Token authentication error"
    })
  }
}

module.exports=isAuth
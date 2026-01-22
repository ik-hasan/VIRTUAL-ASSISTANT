
require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = async(req,res)=>{
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("DB CONNECTED")
  } catch (error) {
    console.log("DB ERROR" , error);
  }
}

module.exports = connectDb
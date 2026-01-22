const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes');
const { geminiResponse } = require('./gemini');
const port = process.env.port || 5000


//cors error resolver,is port/frontend se aane wala data hi lega
app.use(cors({
  // origin:"http://localhost:5173",
  origin:"https://virtualassistant-cuzv.onrender.com",
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);




//testing the response of gemini api
app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data);
});


app.listen(port,(req,res)=>{
  db();
  console.log(`server running on http://localhost:${port}`)
})

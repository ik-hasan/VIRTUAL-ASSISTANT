 

//ye kyu bna rhe hm ? current user ka data lene ke liye,to hm ye current user ka data le kyu rhe h ?
//taaki frontend me user ka data dikhaya ja ske,jaise ki uska name,email etc
const User = require("../models/user.model")
const getCurrentUser = async(req,res)=>{
  try {
    const userId = req.userId
    const user = await User.findById(userId).select("-password");

    if(!user) {
      return res.status(400).json({
        message:"Current user not found"
      })
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Get current user error", error);
    return res.status(400).json({
      message:"Get current user error"
    })
  }
}



const uploadOnCloudinary = require('../config/cloudinary');

const updateAssistant = async(req,res)=>{
  try {
    const {assistantName,imageUrl} = req.body;
    let assistantImage;

    //agr fronted me kisi ne wo 7 photos ke alawa apni khud ki koi
    //image set kiya to usey hm cloudinary pr store krwaenge aur
    //cloudinary se res me mile secure_url ko db me store krenge
    if(req.file){
      assistantImage = await uploadOnCloudinary(req.file.path);
    }
    // ya fir agr unme se koi 1 select krta h to iska path just
    //db me store krwaenge 
    else{
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(req.userId,{
      assistantImage,assistantName
    },{new:true}).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("Update assistant info error", error);
    return res.status(400).json({
      message:"Update assistant info error"
    })
  }
}



//this controller is new for me
const moment = require('moment');
const  {geminiResponse} = require('../gemini')
const askToAssistant = async(req,res)=>{
  try {

    //Frontend se jo user bol/likh raha haiwo command me le rhe
    //Example: "what is the time?"
    const { command } = req.body; 
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(
      command,
      assistantName,
      userName
    );


    //Gemini response me plain text + json hoga & we only want json ke andr wali details
    //example - 
    // Sure! Here is the response:
    // {
    //   "type": "get-time",
    //   "userInput": "what is the time",
    //   "response": "Here is the current time"
    // }
    //isliye Regex se JSON( { } ke andr wala part) extract kiya
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({
        response: "sorry, i can't understand"
      });
    }
    const gemResult = JSON.parse(jsonMatch[0]);
    //now gemResult will look like this
    // {
    //   type: "get-time",
    //   userInput: "what is the time",
    //   response: "Here is the current time"
    // }

    const type = gemResult.type;

    // History me command add kro
    user.history.push(gemResult.userInput);
    await user.save();

    switch(type){
      //yha hm Gemini ke response ko ignore kar rhe & Apna accurate real-time data bhej rhe (it's good practice)
      //Gemini guess karta hai, Time/date galat ho sakta hai,Timezone mismatch, isliye hm gemini se sirf intent le rhe & actual data server se bhej rhe
      case 'get-date' : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`current date is ${moment().format("YYYY-MM-DD")}`
      });

      case 'get-time' : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`current time is ${moment().format("hh:mm A")}`
      });

      case 'get-day' : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`today is ${moment().format("dddd")}`
      });

      case 'get-month' : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`today is ${moment().format("MMMM")}`
      });

      //yha pr hm gemini ka hi response bhej de hre bcz these type of response from Gemini AI is -> ok ok
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "whatsapp-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({
          response: "I didn't understand that command."
        });
    }

  } catch (error) {
    return res.status(500).json({
      response: `ask assistant error${error}`
    });

  }
}
// agr switch case nhi lgate to full depend on Gemini AI no control bugs+hallucination

module.exports = { getCurrentUser, updateAssistant, askToAssistant }

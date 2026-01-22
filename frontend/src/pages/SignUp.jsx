import React, { useContext, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import { NavLink, useNavigate } from "react-router-dom";
import { userDataContext } from '../context/UserContext'
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {serverUrl,userData, setUserData} = useContext(userDataContext);
  const[err,setErr] = useState("");
  const[loading,setLoading] = useState(false);

  //frontend se data backend ko bhejrhe h, form me jo data
  //fill kiya h usey axios ke through diye gye path pr bhej rhe h,
  //srverUrl me jis port pr backend run ho rha uska path h
  // fir backend ke serverUrl/api/auth/signup page pr data ja rha
  //frontend backend connect krne pr ek cors error aata h, usey
  // resolve krne ke liye uska code backend me index.js me likhenge
  //cors ke through hm bs backend ko btate h ki tmhe data kis
  //frontend se lena h ya fir kis port se
  const handleSignUp = async (e)=>{
    e.preventDefault(); 
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`,{
        name,
        email,
        password
      },{withCredentials:true});
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
      
    } catch (error) {
      console.log("Sign up data bhejne me error : ",error);
      setUserData(null);
      //yha pr backend se jo err aega usey set krdenge err state me
      setErr(error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]" onSubmit={handleSignUp}>
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}

        />
        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-[20px] right-[20px] text-white cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className="absolute top-[20px] right-[20px] text-white cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
        </div>

        {/* backend se aane wala error yha show krenge */}
        {err.length>0 && <p className="text-red-500 text-[17px]">{err}</p>}

        <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ? <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

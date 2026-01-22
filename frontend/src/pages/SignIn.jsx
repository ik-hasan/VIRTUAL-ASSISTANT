import React, { useContext, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import { NavLink, useNavigate } from "react-router-dom";
import { userDataContext } from '../context/UserContext'
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {serverUrl,userData, setUserData} = useContext(userDataContext);
  const[err,setErr] = useState("");
  const[loading,setLoading] = useState(false);

  const handleSignIn = async (e)=>{
    e.preventDefault(); 
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`,{
        email,
        password
      },{withCredentials:true});
      setUserData(result.data);
      setLoading(false);
      navigate("/");
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
      <form className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]" onSubmit={handleSignIn}>
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Sign In to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

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

        {err.length>0 && <p className="text-red-500 text-[17px]">{err}</p>}

        <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer" disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a New Account ? <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;

import axios from "axios";
import { createContext,useState,useEffect } from "react"

const userDataContext = createContext();


//jaise hi ui render hoga ye code chal jaega
//& ye backend ko is route pr call kr dega 
// ${serverUrl}/api/user/current to server is route pr lge handlers
//ko chla dega, jo ki hmne isAuth aur getCurrentUser lga rkhe h
//isAuth middleware h, wo token verify krega aur userId
//request me add krdega, fir getCurrentUser controller chlega
//ye currentuser ka data db se le kr bhejdega aur fir hm 
//yhi pr setUserData(result.data) krdenge jo context me h
function UserContext({children}){
  const serverUrl = "http://localhost:8000"
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );
      setUserData(result.data);
      console.log(result.data);
      console.log("Current user data fetched successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async(command)=>{
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
      console.log('gemini response received')
      // Update user data with new history
      // await handleCurrentUser();
      return result.data
    } catch (error) {
      console.log("getGeminiResponse error",error);
    }
  }
  useEffect(() => {
    handleCurrentUser();
  }, []);



  const value = {
    serverUrl,userData, setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage,getGeminiResponse
  }
  return(
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export { userDataContext }
export default UserContext
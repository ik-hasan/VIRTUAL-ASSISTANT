import { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || "",
  );

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      //wo 7 images me se koi ek select
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      }
      //cloudinary wali image
      else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true },
      );
      console.log(result.data);
      setUserData(result.data);
      setLoading(false);
      navigate("/");  
    } catch (error) {
      setLoading(false);
      console.log("handleUpdateAssistant error : ", error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
      <MdKeyboardBackspace
        className="absolute top-4 left-4 text-white cursor-pointer"
        size={28}
        onClick={() => navigate(-1)}
      />

      <h1 className="text-white mb-[40px] text-[30px] text-center">
        Enter Your <span className="text-blue-200">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg. shifra"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-[250px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {loading ? "Creating..." : "Create Your Assistant"}
        </button>
      )}
    </div>
  );
}
export default Customize2;

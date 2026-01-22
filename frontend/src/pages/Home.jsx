// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { userDataContext } from "../context/UserContext";
// import axios from "axios";
// import { useEffect } from "react";
// import { useState } from "react";
// import { useRef } from "react";
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";

// function Home() {
//   const navigate = useNavigate();
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [isInitialized, setIsInitialized] = useState(false);
//   const[ham,setHam]=useState(false);
//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);

//   const handleLogOut = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       console.log(error);
//       setUserData(null);
//     }
//   };

//   // Initialize speech with user interaction
//   const initializeSpeech = () => {
//     if (!isInitialized) {
//       // Play a silent utterance to initialize speech synthesis
//       const utterance = new SpeechSynthesisUtterance("");
//       synthRef.current.speak(utterance);
//       setIsInitialized(true);
//       console.log("Speech initialized");

//       // Start recognition after initialization
//       setTimeout(() => {
//         startRecognition();
//       }, 500);
//     }
//   };

//   const startRecognition = () => {
//     try {
//       if (recognitionRef.current && !isSpeakingRef.current && isInitialized) {
//         recognitionRef.current.start();
//         setListening(true);
//       }
//     } catch (error) {
//       if (
//         !error.message.includes("start") &&
//         error.name !== "InvalidStateError"
//       ) {
//         console.error("Recognition error:", error);
//       }
//     }
//   };

//   // Text to speech with better error handling
//   const speak = (text) => {
//     if (!text || text.trim() === "") return;

//     // Check if speech synthesis is available
//     if (!window.speechSynthesis) {
//       console.error("Speech Synthesis not supported");
//       setAiText("");
//       setTimeout(() => startRecognition(), 500);
//       return;
//     }

//     const synth = synthRef.current;

//     // Cancel any ongoing speech
//     synth.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "hi-IN";

//     // Wait for voices to load
//     const setVoice = () => {
//       const voices = synth.getVoices();
//       const hindiVoice = voices.find(
//         (v) => v.lang === "hi-IN" || v.lang.startsWith("hi"),
//       );
//       if (hindiVoice) {
//         utterance.voice = hindiVoice;
//       }
//     };

//     // Voices might not be loaded yet
//     if (synth.getVoices().length === 0) {
//       synth.onvoiceschanged = setVoice;
//     } else {
//       setVoice();
//     }

//     isSpeakingRef.current = true;

//     utterance.onstart = () => {
//       isSpeakingRef.current = true;
//       // Stop recognition while speaking
//       if (recognitionRef.current) {
//         try {
//           recognitionRef.current.stop();
//         } catch (e) {
//           // Already stopped
//         }
//       }
//     };

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       // Longer delay for better transition
//       setTimeout(() => {
//         startRecognition();
//       }, 800);
//     };

//     utterance.onerror = (event) => {
//       console.error("Speech synthesis error:", event);

//       // Handle "not-allowed" error specifically
//       if (event.error === "not-allowed") {
//         console.warn("Speech blocked by browser. User interaction required.");
//         setAiText("Click anywhere on the page to enable voice");
//         setIsInitialized(false);
//       }

//       isSpeakingRef.current = false;
//       setAiText("");
//       setTimeout(() => {
//         startRecognition();
//       }, 500);
//     };

//     try {
//       synth.speak(utterance);
//     } catch (error) {
//       console.error("Failed to speak:", error);
//       isSpeakingRef.current = false;
//       setAiText("");
//       setTimeout(() => startRecognition(), 500);
//     }
//   };

//   const handleCommand = (data) => {
//     const { type, userInput, response } = data;

//     // Speak first
//     speak(response);

//     // Then execute commands
//     switch (type) {
//       case "google-search":
//         window.open(
//           `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
//           "_blank",
//         );
//         break;
//       case "calculator-open":
//         window.open("https://www.google.com/search?q=calculator", "_blank");
//         break;
//       case "instagram-open":
//         window.open("https://www.instagram.com/", "_blank");
//         break;
//       case "facebook-open":
//         window.open("https://www.facebook.com/", "_blank");
//         break;
//       case "weather-show":
//         window.open("https://www.google.com/search?q=weather", "_blank");
//         break;
//       case "youtube-search":
//       case "youtube-play":
//         window.open(
//           `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
//           "_blank",
//         );
//         break;
//       default:
//         break;
//     }
//   };

//   // Auto-initialize on any user interaction (Option B)
//   useEffect(() => {
//     const handleInteraction = () => {
//       if (!isInitialized) {
//         initializeSpeech();
//         // Remove listeners after first interaction
//         document.removeEventListener("click", handleInteraction);
//         document.removeEventListener("touchstart", handleInteraction);
//         document.removeEventListener("keydown", handleInteraction);
//       }
//     };

//     document.addEventListener("click", handleInteraction);
//     document.addEventListener("touchstart", handleInteraction);
//     document.addEventListener("keydown", handleInteraction);

//     return () => {
//       document.removeEventListener("click", handleInteraction);
//       document.removeEventListener("touchstart", handleInteraction);
//       document.removeEventListener("keydown", handleInteraction);
//     };
//   }, [isInitialized]);

//   // Main recognition setup
//   useEffect(() => {
//     const SpeechRecognition =
//       window.webkitSpeechRecognition || window.SpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error("Speech Recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = "en-US";
//     recognition.maxAlternatives = 1;

//     recognitionRef.current = recognition;
//     const isRecognizingRef = { current: false };
//     let restartTimeout = null;

//     const safeRecognition = () => {
//       // Clear any pending restart
//       if (restartTimeout) {
//         clearTimeout(restartTimeout);
//         restartTimeout = null;
//       }

//       // Only start if initialized
//       if (
//         !isSpeakingRef.current &&
//         !isRecognizingRef.current &&
//         isInitialized
//       ) {
//         try {
//           recognition.start();
//           console.log("Recognition started");
//         } catch (err) {
//           if (err.name !== "InvalidStateError") {
//             console.error("Start error:", err);
//           }
//         }
//       }
//     };

//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);

//       // Restart only if not speaking and initialized
//       if (!isSpeakingRef.current && isInitialized) {
//         restartTimeout = setTimeout(() => {
//           safeRecognition();
//         }, 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);

//       // Don't restart on certain errors
//       const skipErrors = ["aborted", "no-speech", "audio-capture"];
//       if (
//         !skipErrors.includes(event.error) &&
//         !isSpeakingRef.current &&
//         isInitialized
//       ) {
//         restartTimeout = setTimeout(() => {
//           safeRecognition();
//         }, 1500);
//       }
//     };

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       const confidence = e.results[e.results.length - 1][0].confidence;

//       console.log(`Transcript: "${transcript}" (confidence: ${confidence})`);

//       // Check if transcript contains assistant name
//       const assistantName = userData.assistantName.toLowerCase();
//       const lowerTranscript = transcript.toLowerCase();

//       if (lowerTranscript.includes(assistantName)) {
//         setUserText(transcript);
//         setAiText("");

//         // Stop recognition
//         try {
//           recognition.stop();
//           isRecognizingRef.current = false;
//           setListening(false);
//         } catch (e) {
//           // Already stopped
//         }

//         try {
//           // Get AI response
//           const data = await getGeminiResponse(transcript);
//           console.log("AI Response:", data);

//           // Handle the command
//           handleCommand(data);
//           setAiText(data.response);
//         } catch (error) {
//           console.error("Error getting AI response:", error);
//           speak("Sorry, I encountered an error. Please try again.");
//         } finally {
//           setUserText("");
//         }
//       }
//     };

//     // Fallback to restart if stuck
//     const fallbackInterval = setInterval(() => {
//       if (
//         !isSpeakingRef.current &&
//         !isRecognizingRef.current &&
//         isInitialized
//       ) {
//         safeRecognition();
//       }
//     }, 15000);

//     // Initial start only if initialized
//     if (isInitialized) {
//       safeRecognition();
//     }

//     // Cleanup
//     return () => {
//       if (restartTimeout) {
//         clearTimeout(restartTimeout);
//       }
//       clearInterval(fallbackInterval);
//       try {
//         recognition.stop();
//       } catch (e) {
//         // Already stopped
//       }
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, [isInitialized, userData.assistantName]);

//   // // Greeting on page load
//   // useEffect(() => {
//   //   if (userData?.name) {
//   //     const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//   //     greeting.lang = "hi-IN";
//   //     window.speechSynthesis.speak(greeting);
//   //   }
//   // }, []); // Empty dependency - runs only once on mount

//   return (
//     <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] relative">
//       <CgMenuRight className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer" onClick={()=>setHam(true)}/>

//       <div className={`absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col items-start justify-center gap-4 lg:hidden transition-transform ${ham?'translate-x-0':'translate-x-[100%]'}`}>
//         <RxCross1 className="text-white absolute cursor-pointer top-[20px] right-[25px] w-[25px] h-[25px]" onClick={()=>setHam(false)}/>
//         <button
//           className="min-w-[150px] h-[60px] text-white font-semibold  rounded-full text-[19px] border-white border px-[20px] py-[10px] cursor-pointer hover:bg-white hover:text-black transition-colors "
//           onClick={handleLogOut}
//         >
//           Logout
//         </button>

//         <button
//           className="min-w-[150px] h-[60px] text-white font-semibold  rounded-full text-[19px] border-white border px-[20px] py-[10px] cursor-pointer hover:bg-white hover:text-black transition-colors"
//           onClick={() => navigate("/customize")}
//         >
//           Customize Assistant
//         </button>
//         <div className="w-full h-[2px] bg-gray-400"></div>

//         <h1 className="text-white font-semibold text-[19px]">History</h1>

//         <div className="w-full h-[400px] overflow-y-auto flex flex-col gap-[20px]">
//           {userData.history?.map((his,index) => (
//             <span key={index} className="text-gray-400 text-[18px] truncate">{his}</span>
//           ))}
//         </div>
//       </div>

//       <button
//         className="min-w-[150px] h-[60px] mt-[30px] text-white font-semibold absolute top-[20px] right-[20px] border border-white rounded-full text-[19px] cursor-pointer hover:bg-white hover:text-black transition-colors hidden lg:block"
//         onClick={handleLogOut}
//       >
//         Logout
//       </button>

//       <button
//         className="min-w-[150px] h-[60px] mt-[30px] px-[20px] py-[10px] text-white font-semibold absolute top-[100px] right-[20px] border border-white rounded-full text-[19px] cursor-pointer hover:bg-white hover:text-black transition-colors hidden lg:block"
//         onClick={() => navigate("/customize")}
//       >
//         Customize Assistant
//       </button>

//       {/* Message when not initialized - shows at top */}
//       {!isInitialized && (
//         <div className="text-white absolute top-[200px] left-[50%] transform -translate-x-1/2 bg-black px-6 py-3 rounded-lg font-semibold shadow-lg animate-pulse">
//           Click anywhere to activate Assistant
//         </div>
//       )}

//       <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
//         <img
//           src={userData?.assistantImage}
//           alt=""
//           className="h-full object-cover"
//         />
//       </div>

//       <h1 className="text-white text-[18px] font-semibold">
//         I'm {userData?.assistantName}
//       </h1>

//       {/* User and AI status */}
//       <div className="flex flex-col items-center gap-2">
//         {userText && (
//           <div className="text-white px-4 py-2 rounded-lg max-w-[400px]">
//             <p className="text-sm font-medium">You: {userText}</p>
//           </div>
//         )}

//         {aiText && (
//           <div className="text-white px-4 py-2 rounded-lg max-w-[400px]">
//             <p className="text-sm font-medium">
//               {userData?.assistantName}: {aiText}
//             </p>
//           </div>
//         )}
//       </div>

//       {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
//       {aiText && <img src={aiImg} alt="" className="w-[200px]" />}
//     </div>
//   );
// }

// export default Home;

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [ham, setHam] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  // Initialize speech with user interaction
  const initializeSpeech = () => {
    if (!isInitialized) {
      // Play a silent utterance to initialize speech synthesis
      const utterance = new SpeechSynthesisUtterance("");
      synthRef.current.speak(utterance);
      setIsInitialized(true);
      console.log("Speech initialized");

      // Start recognition after initialization
      setTimeout(() => {
        startRecognition();
      }, 500);
    }
  };

  const startRecognition = () => {
    try {
      if (recognitionRef.current && !isSpeakingRef.current && isInitialized) {
        recognitionRef.current.start();
        setListening(true);
      }
    } catch (error) {
      if (
        !error.message.includes("start") &&
        error.name !== "InvalidStateError"
      ) {
        console.error("Recognition error:", error);
      }
    }
  };

  // Text to speech with better error handling - FIXED VERSION
  const speak = (text) => {
    if (!text || text.trim() === "") return;

    if (!window.speechSynthesis) {
      console.error("Speech Synthesis not supported");
      setAiText("");
      setTimeout(() => startRecognition(), 500);
      return;
    }

    const synth = synthRef.current;
    
    // IMPORTANT: Stop recognition FIRST before speaking
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setListening(false);
      } catch (e) {
        console.log("Recognition already stopped");
      }
    }

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const setVoice = () => {
      const voices = synth.getVoices();
      const hindiVoice = voices.find(
        (v) => v.lang === "hi-IN" || v.lang.startsWith("hi"),
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }

    utterance.onstart = () => {
      console.log("Speech started");
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setAiText("");
      isSpeakingRef.current = false;
      
      // INCREASED DELAY - give more time before restarting recognition
      setTimeout(() => {
        if (!isSpeakingRef.current && isInitialized) {
          startRecognition();
        }
      }, 1500); // Increased from 800ms to 1500ms
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);

      if (event.error === "not-allowed") {
        console.warn("Speech blocked by browser. User interaction required.");
        setAiText("Click anywhere on the page to enable voice");
        setIsInitialized(false);
      }

      isSpeakingRef.current = false;
      setAiText("");
      
      setTimeout(() => {
        if (!isSpeakingRef.current && isInitialized) {
          startRecognition();
        }
      }, 1000);
    };

    // Set speaking state before starting
    isSpeakingRef.current = true;
    
    try {
      synth.speak(utterance);
    } catch (error) {
      console.error("Failed to speak:", error);
      isSpeakingRef.current = false;
      setAiText("");
      setTimeout(() => startRecognition(), 1000);
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    // Speak first
    speak(response);

    // Then execute commands
    switch (type) {
      case "google-search":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank",
        );
        break;
      case "calculator-open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "instagram-open":
        window.open("https://www.instagram.com/", "_blank");
        break;
      case "facebook-open":
        window.open("https://www.facebook.com/", "_blank");
        break;
      case "whatsapp-open":
        window.open("https://web.whatsapp.com/", "_blank");
        break;
      case "weather-show":
        window.open("https://www.google.com/search?q=weather", "_blank");
        break;
      case "youtube-search":
      case "youtube-play":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
          "_blank",
        );
        break;
      default:
        break;
    }
  };

  // Auto-initialize on any user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!isInitialized) {
        initializeSpeech();
        // Remove listeners after first interaction
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [isInitialized]);

  // Main recognition setup - FIXED VERSION
  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };
    let restartTimeout = null;

    const safeRecognition = () => {
      // Clear any pending restart
      if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
      }

      // STRICT CHECK: Only start if NOT speaking and initialized
      if (!isSpeakingRef.current && !isRecognizingRef.current && isInitialized) {
        try {
          recognition.start();
          console.log("Recognition started");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error:", err);
          }
        }
      } else {
        console.log("Skipping recognition start:", {
          speaking: isSpeakingRef.current,
          recognizing: isRecognizingRef.current,
          initialized: isInitialized
        });
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition is now active");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition ended");

      // ONLY restart if not speaking
      if (!isSpeakingRef.current && isInitialized) {
        restartTimeout = setTimeout(() => {
          safeRecognition();
        }, 1500); // Increased delay
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      // Don't restart on these errors
      const skipErrors = ["aborted", "no-speech", "audio-capture"];
      
      if (!skipErrors.includes(event.error) && !isSpeakingRef.current && isInitialized) {
        restartTimeout = setTimeout(() => {
          safeRecognition();
        }, 2000); // Increased delay for errors
      } else {
        console.log("Skipping restart due to error:", event.error);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      const confidence = e.results[e.results.length - 1][0].confidence;

      console.log(`Transcript: "${transcript}" (confidence: ${confidence})`);

      // Check if transcript contains assistant name
      const assistantName = userData.assistantName.toLowerCase();
      const lowerTranscript = transcript.toLowerCase();

      if (lowerTranscript.includes(assistantName)) {
        setUserText(transcript);
        setAiText("");

        // STOP recognition immediately
        try {
          recognition.stop();
          isRecognizingRef.current = false;
          setListening(false);
        } catch (e) {
          console.log("Recognition already stopped");
        }

        try {
          // Get AI response
          const data = await getGeminiResponse(transcript);
          console.log("AI Response:", data);

          // Handle the command
          handleCommand(data);
          setAiText(data.response);
        } catch (error) {
          console.error("Error getting AI response:", error);
          speak("Sorry, I encountered an error. Please try again.");
        } finally {
          setUserText("");
        }
      }
    };

    // INCREASED fallback interval to avoid conflicts
    const fallbackInterval = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current && isInitialized) {
        console.log("Fallback: Attempting to restart recognition");
        safeRecognition();
      }
    }, 20000); // Increased from 15s to 20s

    // Initial start
    if (isInitialized) {
      setTimeout(() => {
        safeRecognition();
      }, 1000); // Give time for initialization
    }

    // Cleanup
    return () => {
      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }
      clearInterval(fallbackInterval);
      try {
        recognition.stop();
      } catch (e) {
        console.log("Cleanup: Recognition already stopped");
      }
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [isInitialized, userData.assistantName]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] relative">
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer"
        onClick={() => setHam(true)}
      />

      <div
        className={`absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col items-center justify-center gap-4 lg:hidden transition-transform ${ham ? "translate-x-0" : "translate-x-[100%]"}`}
      >
        <RxCross1
          className="text-white absolute cursor-pointer top-[20px] right-[25px] w-[25px] h-[25px]"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px] text-white font-semibold  rounded-full text-[19px] border-white border px-[20px] py-[10px] cursor-pointer hover:bg-white hover:text-black transition-colors "
          onClick={handleLogOut}
        >
          Logout
        </button>

        <button
          className="min-w-[150px] h-[60px] text-white font-semibold  rounded-full text-[19px] border-white border px-[20px] py-[10px] cursor-pointer hover:bg-white hover:text-black transition-colors"
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>


        {/* <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[400px] overflow-y-auto flex flex-col gap-[20px]">
          {userData.history?.map((his, index) => (
            <span key={index} className="text-gray-400 text-[18px] truncate">
              {his}
            </span>
          ))}
        </div> */}



      </div>

      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-white font-semibold absolute top-[20px] right-[20px] border border-white rounded-full text-[19px] cursor-pointer hover:bg-white hover:text-black transition-colors hidden lg:block"
        onClick={handleLogOut}
      >
        Logout
      </button>

      <button
        className="min-w-[150px] h-[60px] mt-[30px] px-[20px] py-[10px] text-white font-semibold absolute top-[100px] right-[20px] border border-white rounded-full text-[19px] cursor-pointer hover:bg-white hover:text-black transition-colors hidden lg:block"
        onClick={() => navigate("/customize")}
      >
        Customize Assistant
      </button>

      {/* Message when not initialized - shows at top */}
      {!isInitialized && (
        <div className="text-white absolute top-[200px] left-[50%] transform -translate-x-1/2 bg-black px-6 py-3 rounded-lg font-semibold shadow-lg animate-pulse">
          Click anywhere to activate Assistant
        </div>
      )}

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>

      {/* User and AI status */}
      <div className="flex flex-col items-center gap-2">
        {userText && (
          <div className="text-white px-4 py-2 rounded-lg max-w-[400px]">
            <p className="text-sm font-medium">You: {userText}</p>
          </div>
        )}

        {aiText && (
          <div className="text-white px-4 py-2 rounded-lg max-w-[400px]">
            <p className="text-sm font-medium">
              {userData?.assistantName}: {aiText}
            </p>
          </div>
        )}
      </div>

      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}
    </div>
  );
}

export default Home;
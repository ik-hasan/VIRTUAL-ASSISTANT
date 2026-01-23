AI Voice Assistant (React + Web Speech API + Gemini)

A smart AI-powered voice assistant built using **React**, **Web Speech API**, and **Gemini AI**.  
It can listen to user voice commands, generate intelligent responses, speak back, and execute real-world actions like opening websites, searching Google, and more.

Features

- Voice Recognition (Speech → Text)
- Text-to-Speech (Text → Voice)
- AI Responses using Gemini API
- Wake-word detection (Assistant Name Trigger)
- Execute Commands (General, Factual, Google, YouTube, WhatsApp etc.)
- Customizable Assistant (Name & Image)
- Responsive UI with Hamburger Menu
- Smart Speech Loop Handling (No Echo Bug)
- Browser Autoplay Policy Handling

---

Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Web Speech API
  - SpeechRecognition
  - SpeechSynthesis

### Backend
- Node.js
- Express.js
- Gemini API

### Tools & Libraries
- Axios
- React Router
- Context API

---

## System Architecture
  User Voice
  ↓
  SpeechRecognition (Browser API)
  ↓
  Text Command
  ↓
  Gemini AI API
  ↓
  AI Response Text
  ↓
  SpeechSynthesis (Browser API)
  ↓
  Voice Output + Command Execution

How It Works
1. User clicks anywhere on the screen to activate the assistant.
2. Assistant starts listening using SpeechRecognition.
3. When the user says the assistant's name, it triggers AI processing.
4. Gemini API generates a response.
5. Assistant speaks the response using SpeechSynthesis.
6. Based on the response type, the assistant executes commands (e.g., Google search, YouTube search).

Example Commands

| Command                           | Action              |
| --------------------------------- | ------------------- |
| "Hey Jarvis, search AI on Google" | Opens Google search |
| "Hey Jarvis, open YouTube"        | Opens YouTube       |
| "Hey Jarvis, what's the weather?" | Shows weather       |
| "Hey Jarvis, open WhatsApp"       | Opens WhatsApp      |


IKRAMUL HASAN
B.Tech IT | Full Stack Developer
GitHub: https://github.com/ik-hasan

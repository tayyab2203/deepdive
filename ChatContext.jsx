import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Optional: Fetch history globally here
  const fetchChatHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const backendUrl = "https://cc1c0f99-5357-4179-8f7e-26ef3b745dff-00-2o53aupzrg4d8.kirk.replit.dev";

      const { data } = await axios.get(`${backendUrl}/api/v1/chat/${user._id}`);
      setChatHistory(data.chats); // Expected response: { chats: [...] }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const createNewChat = () => {
    setActiveChat(null);
    setPrompt("");
  };

  return (
    <ChatContext.Provider
      value={{
        prompt,
        setPrompt,
        chatHistory,
        setChatHistory,
        activeChat,
        setActiveChat,
        createNewChat,
        fetchChatHistory, // exposing to Sidebar
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

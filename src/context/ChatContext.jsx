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

      const { data } = await axios.get(`http://localhost:5000/api/v1/chat/${user._id}`);
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

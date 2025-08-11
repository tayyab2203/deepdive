import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';
import profile from "../../public/user.png";
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChat } from '../context/ChatContext';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const {
    createNewChat,
    chatHistory,
    setActiveChat,
    activeChat,
    fetchChatHistory
  } = useChat();

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      alert(data.message);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
      alert(error?.response?.data?.message || error?.message || "Logout Failed");
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#232327]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 items-center flex justify-between">
        <div className="text-xl font-bold text-white">DeepDive</div>
        <button className="text-gray-300 w-6 h-6">
          <X />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <button
          onClick={createNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4"
        >
          + New chat
        </button>

        {chatHistory.length === 0 ? (
          <p className="text-gray-400 text-sm">No chat history yet</p>
        ) : (
          chatHistory.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setActiveChat(chat)}
              className={`p-2 rounded hover:bg-gray-700 cursor-pointer ${
                activeChat?._id === chat._id ? "bg-gray-700" : ""
              }`}
            >
              {chat.title || "Untitled Chat"}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-gray-700 border-t">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <img className="rounded-full w-8 h-8" src={profile} alt="Profile" />
            <span className="text-gray-300">{user?.firstName || "My Profile"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut /> LogOut
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

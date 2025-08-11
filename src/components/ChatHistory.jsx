// components/ChatHistory.jsx
import React from 'react';
import { useChat } from '../context/ChatContext';

function ChatHistory() {
  const { chatHistory, loadChat, activeChat } = useChat();

  return (
    <div className="space-y-2">
      {chatHistory.map(chat => (
        <button
          key={chat._id}
          onClick={() => loadChat(chat._id)}
          className={`w-full text-left px-3 py-2 rounded-lg ${
            activeChat?._id === chat._id
              ? 'bg-indigo-700 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          {chat.title || "Untitled Chat"}
        </button>
      ))}
    </div>
  );
}

export default ChatHistory;

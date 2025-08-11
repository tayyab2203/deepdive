import React, { useEffect, useRef, useState } from 'react'
import { ArrowUp, Bot, Globe, Paperclip } from 'lucide-react';
import logo from "../../public/logo.png"
import { use } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeTheme = oneDark;

function prompt() {

  const [inputValue, setInputValue] = useState(" ");
  const [typeMessage, setTypeMessage] = useState(" ");

  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const promptEndRef = useRef();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const storedPrompt = localStorage.getItem(`promptHistory_${user._id}`);
    if(storedPrompt){
      setPrompt(JSON.parse(storedPrompt))};
  },[])

  useEffect(()=>{
     const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`promptHistory_${user._id}`,JSON.stringify(prompt));
  },[prompt])

  

  useEffect(() => {
    promptEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [prompt, loading])

  console.log(prompt);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return
    setTypeMessage(trimmed);
    setInputValue("");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("https://cc1c0f99-5357-4179-8f7e-26ef3b745dff-00-2o53aupzrg4d8.kirk.replit.dev/",
        { content: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )
      setPrompt(
        (prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: data.reply }
        ]
      )
    } catch (error) {
      setPrompt(
        (prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: "Something Went Wrong In AI Response..." }
        ]
      )
    }
    finally {
      setLoading(false);
      setTypeMessage(null);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }


  return (
    <div>
      {/* Greeting */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img className='mb-2  w-14 h-12' src={logo} alt="deepdive logo" />
          <h1 className="text-4xl font-medium">Hi, I'm DeepDive.</h1>
        </div>
        <p className="text-gray-400 text-lg">How can I help you today?</p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1">
        {prompt.map((msg, index) => (
          <div key={index} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" ? (<div className='w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={codeTheme}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg mt-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-800 px-1 py-0.5 rounded" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>

            </div>) : (
              <div className='w-[50%] bg-blue-700 text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap'> {msg.content} </div>)}
          </div>
        ))}

        {loading && typeMessage && (
          <div className='w-[50%] bg-blue-700 self-end ml-auto break-words text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap'>{typeMessage}</div>
        )}

        {loading && (
          <div className='flex justify-start w-full'>
            {" "}
            <div className='bg-[#232323] text-white px-4 py-2 text-sm rounded-xl animate-pulse'>Loading...</div></div>
        )}

        <div ref={promptEndRef}/>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex flex-col gap-3">
          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message DeepDive..."
            className="bg-transparent text-white placeholder-gray-400 text-lg outline-none w-full"
          />

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Left side buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Bot className="w-4 h-4" />
                DeepThink (R1)
              </button>
              <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Globe className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button onClick={handleSend} className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default prompt
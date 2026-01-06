import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import Message from './Message';
import { useNavigate } from 'react-router-dom';
import api from '../axios';

const ChatBox = () => {
  const { selectedChat, theme,user,setUser } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');

    const containerRef=useRef(null);
const navigate=useNavigate();
  const onsubmit = async (e) => {
    if (loading) return;
    try {
        e.preventDefault();
        if(!user){
          navigate('/login');
        }
        setLoading(true);
        const promptCopy=prompt;
        setPrompt('');
        setMessages(prev=>[...prev,{role:'user',content:prompt,
          timestamp:Date.now(),isImage:false
        }])

        const {data}=await api.post(`/message/${mode}`,{
          chatId:selectedChat._id,prompt
        });

        if(data.success){
          setMessages(prev=> [...prev ,data.reply ]);
        }
    } catch (error) {
      toast.error(error.message);
      setPrompt(promptCopy)
    }finally{
      setPrompt('');
      setLoading(false);
    }
    
  }

  useEffect(() => {
    if (selectedChat ) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat])


  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behaviour:'smooth'
      })
    }
  },[messages])

  return (
    <div className='flex-1 flex flex-col h-full bg-white dark:bg-transparent transition-all duration-500'>
      
      {/* 1. Messages Area - Clean & Spacious */}
      <div className='flex-1 overflow-y-auto px-4 md:px-10 xl:px-40 py-10 custom-scrollbar'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center animate-fade-in' ref={containerRef}>
            <img 
              src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} 
              alt="Gemini Logo"  
              className='w-48 md:w-64 opacity-90 drop-shadow-2xl'
            />
            <div className='mt-8 space-y-2 text-center'>
              <h1 className='text-4xl md:text-5xl font-black tracking-tight text-gray-800 dark:text-white'>
                Ask Anything
              </h1>
              <p className='text-gray-400 dark:text-[#666] font-medium'>
                Choose a mode and start a conversation with AI
              </p>
            </div>
          </div>
        )}

        {messages.map((messaage, index) => (
          <Message message={messaage} key={index} />
        ))}

        {/* 2. Professional Loading Indicator */}
        {loading && (
          <div className='flex items-center gap-2 p-4 bg-gray-50 dark:bg-white/5 w-max rounded-2xl ml-4 mb-4'>
            <div className='flex gap-1'>
               <div className='w-1.5 h-1.5 rounded-full bg-purple-500 animate-[bounce_1s_infinite_100ms]'></div>
               <div className='w-1.5 h-1.5 rounded-full bg-purple-500 animate-[bounce_1s_infinite_200ms]'></div>
               <div className='w-1.5 h-1.5 rounded-full bg-purple-500 animate-[bounce_1s_infinite_300ms]'></div>
            </div>
            <span className='text-[10px] font-black uppercase tracking-widest text-purple-500/50'>AI is thinking</span>
          </div>
        )}
      </div>


      {/* 3. The "Pro" Input Bar */}
      <div className='pb-8 px-4 md:px-10 xl:px-40'>
        <form 
          onSubmit={onsubmit}
          className='relative flex items-center gap-3 p-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-[24px] shadow-2xl shadow-black/5 focus-within:border-purple-500/50 transition-all max-w-4xl mx-auto'
        >
          {/* Mode Selector */}
          <div className='relative'>
            <select 
              className='appearance-none text-[11px] font-black uppercase tracking-wider pl-4 pr-8 py-2 bg-gray-100 dark:bg-white/5 rounded-full outline-none cursor-pointer text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors '
              onChange={(e) => setMode(e.target.value)} 
              value={mode}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-40'>▼</div>
          </div>

          {/* Input Field */}
          <input 
            type="text" 
            placeholder={mode === 'text' ? "Ask Gemini anything..." : "Describe the image you want to create..."}
            className='flex-1 py-3 text-sm md:text-base bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 px-2'
            required 
            onChange={(e) => setPrompt(e.target.value)} 
            value={prompt}
          />
<button 
  type="submit"
  className={`p-3 rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center ${
    mode === 'text' 
    ? 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-purple-500/20' 
    : 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20'
  } ${loading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
  disabled={loading}
>
  {loading ? (
    /* Loading Spinner */
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
  ) : (
    /* Pro Paper Plane SVG */
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className="w-5 h-5 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )}
</button>
        </form>
        
        {/* Fine Print UX */}
        <p className='text-center mt-3 text-[10px] font-bold text-gray-400 dark:text-[#444] uppercase tracking-widest'>
           Extended Paid Tier
        </p>
      </div>

    </div>
  )
}

export default ChatBox
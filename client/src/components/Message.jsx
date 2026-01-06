import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs';
const Message = ({ message }) => {
  const isUser = message.role === 'user';
  useEffect(()=>{
Prism.highlightAll();
  },[message.content])
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-6 animate-fade-in px-2`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
        
        <div className={`flex flex-col gap-1.5`}>
          {/* Role Label */}
          <span className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? 'You' : 'Gemini'}
          </span>

          <div className={`p-4 rounded-2xl shadow-sm border ${
            isUser 
              ? 'bg-[#7C3AED] border-[#6D28D9] rounded-br-none text-white shadow-purple-500/20' 
              : 'bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10 rounded-bl-none text-gray-800 dark:text-gray-200'
          }`}>
            
            {message.isImage ? (
              <div className="space-y-2">
                <img src={message.content} alt="Generated" className='w-full max-w-sm rounded-xl border border-white/10 shadow-lg' />
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">AI Generated Image</p>
              </div>
            ) : (
              <div className='gemini-markdown'>
                <Markdown>
                  {message.content}
                </Markdown>
              </div>
            )}
          </div>

          {/* Time */}
          <span className={`text-[9px] font-bold text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
             {message.timestamp ? moment(message.timestamp).format('LT') : 'Just now'}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0 mb-8">
          <img 
            src={isUser ? assets.user_icon : assets.logo} 
            alt="avatar"  
            className={`w-9 h-9 rounded-full border-2 ${isUser ? 'border-purple-500/20' : 'border-gray-200 dark:border-white/10'} shadow-md`}
          />
        </div>

      </div>
    </div>
  )
}

export default Message ;


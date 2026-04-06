import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs';
import { useAppContext } from '../context/AppContext';

/* Role colors */
const AI_GRADIENT   = 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)';
const USER_GRADIENT = 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #8B5CF6 100%)';

const Message = ({ message }) => {
  const { theme } = useAppContext();
  const isUser = message.role === 'user';
  const isDark = theme === 'dark';

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-5 animate-fade-in px-1`}>
      <div className={`flex max-w-[88%] md:max-w-[78%] ${isUser ? 'flex-row' : 'flex-row'} items-end gap-3`}>

        {/* ── AI Avatar (left side) ── */}
        {!isUser && (
          <div className="flex-shrink-0 mb-7">
            <div className="w-8 h-8 rounded-xl overflow-hidden p-[1.5px]"
              style={{ background: AI_GRADIENT }}>
              <div className="w-full h-full rounded-[10px] overflow-hidden"
                style={{ background: isDark ? '#1a1a2e' : '#f8f6ff' }}>
                <img src={assets.logo} alt="AI" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* ── Message Content ── */}
        <div className="flex flex-col gap-1.5">
          {/* Role label */}
          <span className={`text-[10px] font-black uppercase tracking-widest ${isUser ? 'text-right' : 'text-left'}`}
            style={{ color: isUser ? '#8B5CF6' : (isDark ? '#f1f5f9' : '#0f172a') }}>
            {isUser ? 'You' : 'Gemini AI'}
          </span>

          {/* Bubble */}
          <div className={`relative px-4 py-3 rounded-2xl shadow-sm overflow-hidden ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
            style={isUser ? {
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
            } : {
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>

            {/* Shimmer overlay for AI bubble in dark mode */}
            {!isUser && isDark && (
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.03) 0%, transparent 50%, rgba(59,130,246,0.03) 100%)',
                }} />
            )}

            {message.isImage ? (
              <div className="space-y-2">
                <img
                  src={message.content}
                  alt="AI Generated"
                  className="w-full max-w-sm rounded-xl shadow-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    AI Generated Image
                  </p>
                </div>
              </div>
            ) : (
              <div className={`gemini-markdown ${isUser ? 'text-white' : ''}`}
                style={{ color: isUser ? '#ffffff' : (isDark ? '#f1f5f9' : '#0f172a') }}>
                <Markdown>{message.content}</Markdown>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span className={`text-[9px] font-semibold mt-0.5 ${isUser ? 'text-right' : 'text-left'}`}
            style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {message.timestamp ? moment(message.timestamp).format('LT') : 'Just now'}
          </span>
        </div>

        {/* ── User Avatar (right side) ── */}
        {isUser && (
          <div className="flex-shrink-0 mb-7">
            <div className="w-8 h-8 rounded-xl overflow-hidden p-[1.5px]"
              style={{ background: USER_GRADIENT }}>
              <div className="w-full h-full rounded-[10px] overflow-hidden"
                style={{ background: isDark ? '#1a1a2e' : '#f8f6ff' }}>
                <img src={assets.user_icon} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Message;

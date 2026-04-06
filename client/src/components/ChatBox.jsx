import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import Message from './Message';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import toast from 'react-hot-toast';

/* Suggestion chips for the empty state */
const SUGGESTIONS = [
  { icon: '🧠', label: 'Explain quantum computing' },
  { icon: '✍️', label: 'Write a cover letter' },
  { icon: '🖼️', label: 'Generate a logo concept', mode: 'image' },
  { icon: '🐛', label: 'Debug my Python code' },
  { icon: '📊', label: 'Summarize a topic' },
  { icon: '🌐', label: 'Translate to Spanish' },
];

const ChatBox = () => {
  const { selectedChat, theme, user } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const onsubmit = async (e) => {
    if (loading) return;
    try {
      e.preventDefault();
      if (!user) { navigate('/login'); return; }
      if (!selectedChat) { toast.error('Select or create a chat first!'); return; }
      setLoading(true);
      const promptCopy = prompt;
      setPrompt('');
      setMessages(prev => [...prev, {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now(),
        isImage: false
      }]);

      const { data } = await api.post(`/message/${mode}`, {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (data.success) {
        setMessages(prev => [...prev, data.reply]);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const handleSuggestion = (s) => {
    setPrompt(s.label);
    if (s.mode) setMode(s.mode);
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (selectedChat) setMessages(selectedChat.messages || []);
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const isDark = theme === 'dark';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-500"
      style={{ background: isDark ? 'transparent' : '#f9f8ff' }}>

      {/* ── Top bar ── */}
      <div className="px-5 py-3.5 flex items-center gap-3 border-b flex-shrink-0"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          backdropFilter: 'blur(12px)',
        }}>

        {/* Mobile menu button */}
        <button
          onClick={() => {}}
          className="md:hidden p-2 rounded-xl transition-all hover:bg-purple-500/10"
          id="mobile-menu-btn"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* AI Status indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={isDark ? assets.logo : assets.logo} alt="AI" className="w-7 h-7 rounded-lg" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: '#10B981', borderColor: isDark ? '#0d0d12' : '#f9f8ff' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Gemini AI</p>
            <p className="text-[10px] font-semibold" style={{ color: '#10B981' }}>● Online</p>
          </div>
        </div>

        {/* Mode Badge */}
        <div className="ml-auto flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border"
            style={{
              background: mode === 'text'
                ? 'rgba(139,92,246,0.1)' : 'rgba(6,182,212,0.1)',
              borderColor: mode === 'text'
                ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.2)',
              color: mode === 'text' ? '#8B5CF6' : '#06B6D4',
            }}>
            {mode === 'text' ? '✦ Text Mode' : '🖼 Image Mode'}
          </div>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-8 xl:px-32 py-6 custom-scrollbar">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center animate-fade-in gap-8">

            {/* Logo + headline */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-[-20px] rounded-full animate-pulse-glow opacity-60" />
                <img
                  src={isDark ? assets.logo_full : assets.logo_full_dark}
                  alt="Gemini Logo"
                  className="w-48 md:w-60 object-contain animate-float relative z-10"
                />
              </div>
              <div className="space-y-2 mt-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight gradient-text-aurora">
                  Ask Anything
                </h1>
                <p className="text-sm font-medium opacity-50">
                  Powered by Google Gemini · Text & Image generation
                </p>
              </div>
            </div>

            {/* Suggestion chips */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="group flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <span className="text-xs font-semibold leading-snug group-hover:opacity-100 transition-opacity"
                    style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <Message message={message} key={index} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-3 animate-fade-in my-4">
            <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden p-[1.5px]"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-white dark:bg-gray-900">
                <img src={assets.logo} className="w-full h-full" alt="AI" />
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl rounded-tl-none"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full dot-bounce"
                    style={{
                      background: ['#8B5CF6', '#3B82F6', '#06B6D4'][i],
                      animationDelay: `${i * 0.18}s`,
                    }} />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Gemini is thinking
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 md:px-8 xl:px-32 pb-6 pt-3 flex-shrink-0">
        <form
          onSubmit={onsubmit}
          className="relative flex items-center gap-3 p-2 rounded-[20px] transition-all duration-300"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
            border: `1.5px solid ${inputFocused
              ? (mode === 'text' ? 'rgba(139,92,246,0.5)' : 'rgba(6,182,212,0.5)')
              : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
            boxShadow: inputFocused
              ? (mode === 'text'
                ? '0 0 0 4px rgba(139,92,246,0.1), 0 8px 32px rgba(139,92,246,0.12)'
                : '0 0 0 4px rgba(6,182,212,0.1), 0 8px 32px rgba(6,182,212,0.12)')
              : '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          {/* Mode Selector */}
          <div className="relative flex-shrink-0">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="appearance-none text-[11px] font-black uppercase tracking-wider pl-3 pr-6 py-2.5 rounded-xl outline-none cursor-pointer transition-all"
              style={{
                background: mode === 'text' ? 'rgba(139,92,246,0.12)' : 'rgba(6,182,212,0.12)',
                color: mode === 'text' ? '#8B5CF6' : '#06B6D4',
                border: `1px solid ${mode === 'text' ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.2)'}`,
              }}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-50">▼</div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 flex-shrink-0"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={mode === 'text'
              ? "Ask Gemini anything…"
              : "Describe the image you want to create…"}
            className="flex-1 py-2.5 text-sm md:text-[15px] bg-transparent outline-none font-medium"
            style={{
              color: isDark ? '#e2e8f0' : '#1e293b',
              caretColor: mode === 'text' ? '#8B5CF6' : '#06B6D4',
            }}
            required
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 active:scale-90"
            style={{
              background: loading || !prompt.trim()
                ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
                : (mode === 'text'
                  ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                  : 'linear-gradient(135deg, #06B6D4, #14B8A6)'),
              boxShadow: (!loading && prompt.trim())
                ? (mode === 'text'
                  ? '0 4px 16px rgba(139,92,246,0.35)'
                  : '0 4px 16px rgba(6,182,212,0.35)')
                : 'none',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              transform: (!loading && prompt.trim()) ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-center mt-2.5 text-[10px] font-bold uppercase tracking-widest opacity-30">
          Gemini may make mistakes · Verify important info
        </p>
      </div>
    </div>
  )
}

export default ChatBox
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import api from '../axios.js'
import toast from 'react-hot-toast'

/* Animated orbs - same as Login for consistency */
const Orbs = () => (
  <>
    <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'float 9s ease-in-out infinite',
      }} />
    <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.06) 50%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'float 11s ease-in-out infinite reverse',
      }} />
    <div className="absolute top-[50%] right-[20%] w-[250px] h-[250px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'float 13s ease-in-out infinite',
        animationDelay: '3s',
      }} />
  </>
);

const GridOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(6,182,212,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }} />
);

/* Feature badges displayed on the left panel */
const FEATURES = [
  { icon: '🤖', label: 'AI-powered responses', color: '#8B5CF6' },
  { icon: '🖼️', label: 'Image generation', color: '#3B82F6' },
  { icon: '⚡', label: 'Real-time streaming', color: '#06B6D4' },
  { icon: '🔒', label: 'Encrypted chats', color: '#10B981' },
];

const Signup = () => {
  const { theme, setTheme, setUser } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const isDark = theme === 'dark';

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/user/register', { name, email, password });
      if (data.success) {
        setUser(data.user);
        toast.success("Welcome to QuickGPT! 🎉");
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden px-4 transition-all duration-500"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 70% 20%, rgba(6,182,212,0.15) 0%, #0a0a12 50%, #050508 100%)'
          : 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 40%, #ede9fe 100%)',
      }}>

      <Orbs />
      <GridOverlay />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Glow behind card */}
        <div className="absolute inset-0 rounded-[32px] blur-2xl opacity-30"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }} />

        <form onSubmit={onSubmitHandler}
          className="relative rounded-[28px] p-8 md:p-10 transition-all duration-500"
          style={{
            background: isDark
              ? 'rgba(15,15,25,0.8)'
              : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(30px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`,
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 24px 64px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(139,92,246,0.6), transparent)' }} />

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={isDark ? assets.logo_full : assets.logo_full_dark}
              alt="Logo"
              className="h-10 object-contain mb-7 animate-float"
            />
            <h1 className="text-3xl font-black tracking-tight mb-1"
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Create account
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-40">
              Join QuickGPT today
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${focused === 'name'
                  ? '#06B6D4'
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                boxShadow: focused === 'name' ? '0 0 0 4px rgba(6,182,212,0.1)' : 'none',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: focused === 'name' ? '#06B6D4' : '#9ca3af' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                placeholder="Full name"
                required
                disabled={isSubmitting}
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-40"
                style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                onChange={(e) => setName(e.target.value)}
                value={name}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Email */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${focused === 'email'
                  ? '#06B6D4'
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                boxShadow: focused === 'email' ? '0 0 0 4px rgba(6,182,212,0.1)' : 'none',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: focused === 'email' ? '#06B6D4' : '#9ca3af' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                required
                disabled={isSubmitting}
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-40"
                style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Password */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${focused === 'password'
                  ? '#06B6D4'
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                boxShadow: focused === 'password' ? '0 0 0 4px rgba(6,182,212,0.1)' : 'none',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: focused === 'password' ? '#06B6D4' : '#9ca3af' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                required
                disabled={isSubmitting}
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-40"
                style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                disabled={isSubmitting}
                className="opacity-40 hover:opacity-100 transition-opacity text-sm disabled:opacity-20"
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            style={{
              background: isSubmitting 
                ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                : 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
              boxShadow: isSubmitting 
                ? 'none' 
                : '0 8px 32px rgba(6,182,212,0.3)',
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>

          {/* Bottom links */}
          <div className="flex items-center justify-center mt-6 text-xs">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium transition-colors"
              style={{ color: isDark ? '#67e8f9' : '#0891b2' }}
            >
              Already have an account? Sign in
            </button>
          </div>

          {/* Features showcase */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4 opacity-40">
              What you get
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <span className="text-lg">{feature.icon}</span>
                  <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup

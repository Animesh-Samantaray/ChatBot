import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import api from '../axios.js'
import toast from 'react-hot-toast'

/* Animated background orbs */
const Orbs = () => (
  <>
    <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
    <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'float 12s ease-in-out infinite',
        animationDelay: '2s',
      }} />
  </>
);

/* Floating grid lines */
const GridOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }} />
);

const Login = () => {
  const { theme, setTheme, setUser } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const isDark = theme === 'dark';

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/user/login', { email, password });
      if (data.success) {
        setUser(data.user);
        toast.success("Welcome back! 🎉");
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden px-4 transition-all duration-500"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.15) 0%, #0a0a12 50%, #050508 100%)'
          : 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #e0f2fe 100%)',
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
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }} />

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
              : '0 24px 64px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(59,130,246,0.6), transparent)' }} />

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={isDark ? assets.logo_full : assets.logo_full_dark}
              alt="Logo"
              className="h-10 object-contain mb-7 animate-float"
            />
            <h1 className="text-3xl font-black tracking-tight mb-1"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Welcome back
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-40">
              Sign in to continue
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Email */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${focused === 'email'
                  ? '#8B5CF6'
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                boxShadow: focused === 'email' ? '0 0 0 4px rgba(139,92,246,0.1)' : 'none',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: focused === 'email' ? '#8B5CF6' : '#9ca3af' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                required
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-40"
                style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
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
                  ? '#8B5CF6'
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                boxShadow: focused === 'password' ? '0 0 0 4px rgba(139,92,246,0.1)' : 'none',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: focused === 'password' ? '#8B5CF6' : '#9ca3af' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                required
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-40"
                style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="opacity-40 hover:opacity-100 transition-opacity text-sm">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-flow 3s ease infinite',
              boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
            }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">or</span>
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm font-medium opacity-60">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="font-black cursor-pointer transition-all hover:opacity-100"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create one →
            </span>
          </p>
        </form>
      </div>

      {/* Bottom watermark */}
      <p className="absolute bottom-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-20">
        Powered by Google Gemini
      </p>
    </div>
  )
}

export default Login
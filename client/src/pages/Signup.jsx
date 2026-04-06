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
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const isDark = theme === 'dark';

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/user/signup', { name, email, password });
      if (data.success) {
        setUser(data.user);
        toast.success("Account created! Welcome 🎉");
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  /* Input field factory */
  const Field = ({ id, type = 'text', placeholder, value, onChange, icon, extra }) => (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
      style={{
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        border: `1.5px solid ${focused === id
          ? '#06B6D4'
          : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
        boxShadow: focused === id ? '0 0 0 4px rgba(6,182,212,0.1)' : 'none',
      }}
    >
      <span className="text-base flex-shrink-0"
        style={{ opacity: focused === id ? 1 : 0.4, transition: 'opacity 0.2s ease' }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        required
        className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-40"
        style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
        onChange={onChange}
        value={value}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused('')}
      />
      {extra}
    </div>
  );

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden px-4 py-8 transition-all duration-500"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 70% 30%, rgba(6,182,212,0.12) 0%, #0a0a12 50%, #050508 100%)'
          : 'linear-gradient(135deg, #ecfeff 0%, #ede9fe 50%, #dbeafe 100%)',
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

      <div className="relative z-10 w-full max-w-md animate-scale-in">

        {/* Glow behind card */}
        <div className="absolute inset-0 rounded-[32px] blur-2xl opacity-25"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }} />

        <form onSubmit={onSubmitHandler}
          className="relative rounded-[28px] p-8 md:p-10 transition-all duration-500"
          style={{
            background: isDark ? 'rgba(15,15,25,0.8)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(30px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`,
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 24px 64px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Top accent line - cyan/purple gradient */}
          <div className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.7), rgba(139,92,246,0.7), transparent)' }} />

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
              Get started
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-40">
              Join the AI revolution
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-3.5">
            <Field id="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} icon="👤" />
            <Field id="email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} icon="✉️" />
            <Field
              id="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="🔑"
              extra={
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="opacity-40 hover:opacity-100 transition-opacity text-sm flex-shrink-0">
                  {showPass ? '🙈' : '👁'}
                </button>
              }
            />
          </div>

          {/* Feature badges */}
          <div className="grid grid-cols-2 gap-2 mt-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${f.color}20`,
                }}>
                <span className="text-sm">{f.icon}</span>
                <span className="text-[10px] font-bold opacity-60 leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 50%, #8B5CF6 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-flow 3s ease infinite',
              boxShadow: '0 6px 24px rgba(6,182,212,0.35)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account →'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">or</span>
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm font-medium opacity-60">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="font-black cursor-pointer transition-all hover:opacity-100"
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sign in →
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

export default Signup
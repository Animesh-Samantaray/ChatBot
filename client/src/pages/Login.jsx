import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Login = () => {
  const { theme, setTheme } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='relative min-h-screen w-screen flex items-center justify-center bg-[#F3F4F6] dark:bg-[#0F0F0F] transition-all duration-500 overflow-hidden px-4'>
      
      {/* Background Glows - Only visible in Dark Mode for that AI feel */}
      <div className='absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-600/10 blur-[130px] rounded-full animate-pulse hidden dark:block'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse hidden dark:block'></div>

      {/* Theme Toggle Button */}
      <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='absolute top-8 right-8 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl hover:scale-110 transition-transform z-50'
      >
          <img src={assets.theme_icon} className='w-5 not-dark:invert opacity-70' alt="theme" />
      </button>

      <form onSubmit={onSubmitHandler} className='relative z-10 w-full max-w-md bg-white dark:bg-white/5 backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-2xl transition-all duration-500'>
        
        <div className='flex flex-col items-center mb-10'>
          <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="Logo" className='w-40 mb-8 drop-shadow-xl' />
          <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase'>Welcome Back</h2>
          <p className='text-gray-500 dark:text-[#555] text-[10px] font-bold uppercase tracking-[0.2em] mt-3'>Enter your workspace credentials</p>
        </div>

        <div className='space-y-4'>
          {/* Email Input */}
          <div className='group flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all'>
             <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
             <input type="email" placeholder='Email Address' required className='w-full bg-transparent outline-none text-gray-800 dark:text-white text-sm placeholder:text-gray-400 font-medium' onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>

          {/* Password Input */}
          <div className='group flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all'>
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <input type="password" placeholder='Password' required className='w-full bg-transparent outline-none text-gray-800 dark:text-white text-sm placeholder:text-gray-400 font-medium' onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
        </div>

        <button className='w-full py-4 mt-10 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all'>
          Login
        </button>

        <div className='mt-8 text-center'>
          <p className='text-gray-500 text-xs font-bold'>Don't have an account? 
            <span onClick={() => navigate('/signup')} className='ml-2 text-purple-600 dark:text-purple-400 font-black cursor-pointer hover:underline'>Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  )
}
export default Login
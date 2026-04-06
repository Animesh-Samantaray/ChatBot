import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css';
import Loading from './components/Loading'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const isAuthRoute = (pathname) =>
  ['/login', '/signup', '/loading'].includes(pathname);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, theme } = useAppContext();
  const isDark = theme === 'dark';

  /* Auth pages render full-screen without app shell */
  if (isAuthRoute(pathname)) {
    return (
      <>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: isDark ? '#1a1a2e' : '#ffffff',
              color: isDark ? '#e2e8f0' : '#1e293b',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            },
          }}
        />
        <Routes>
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: isDark ? '#1a1a2e' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#1e293b',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#8B5CF6', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#F43F5E', secondary: '#fff' },
          },
        }}
      />

      {/* Mobile hamburger — shown only when sidebar is closed */}
      {!isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-4 left-4 z-[100] md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
            backdropFilter: 'blur(12px)',
          }}
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main shell */}
      <div
        className="flex h-screen w-screen overflow-hidden transition-all duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top left, #12082a 0%, #0d0d12 40%, #050508 100%)'
            : '#f5f3ff',
        }}
      >
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        <Routes>
          <Route path="/"           element={<ChatBox />} />
          <Route path="/community"  element={<Community />} />
          <Route path="/crdits"     element={<Credits />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

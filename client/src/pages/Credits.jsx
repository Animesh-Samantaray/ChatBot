import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const CREDITS = [
  {
    category: 'AI Engine',
    color: '#8B5CF6',
    icon: '🤖',
    items: [
      { name: 'Google Gemini Pro', role: 'Text generation & reasoning' },
      { name: 'Gemini Vision', role: 'Image understanding' },
      { name: 'Imagen', role: 'AI image generation' },
    ]
  },
  {
    category: 'Frontend',
    color: '#3B82F6',
    icon: '🎨',
    items: [
      { name: 'React 18', role: 'UI library' },
      { name: 'Vite', role: 'Build tool & dev server' },
      { name: 'Tailwind CSS v4', role: 'Utility-first styling' },
      { name: 'React Router v6', role: 'Client-side routing' },
    ]
  },
  {
    category: 'Backend',
    color: '#06B6D4',
    icon: '⚙️',
    items: [
      { name: 'Node.js + Express', role: 'REST API server' },
      { name: 'MongoDB + Mongoose', role: 'Database & ODM' },
      { name: 'JWT + Cookies', role: 'Authentication' },
    ]
  },
  {
    category: 'Libraries',
    color: '#10B981',
    icon: '📦',
    items: [
      { name: 'react-hot-toast', role: 'Toast notifications' },
      { name: 'react-markdown', role: 'Markdown rendering' },
      { name: 'PrismJS', role: 'Syntax highlighting' },
      { name: 'Moment.js', role: 'Date formatting' },
    ]
  },
];

const Credits = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 h-screen overflow-y-auto custom-scrollbar transition-all duration-500"
      style={{ background: isDark ? 'transparent' : '#f5f3ff' }}>
      <div className="p-6 md:p-10 xl:px-20 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 animate-fade-in text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[11px] font-black uppercase tracking-widest"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: '#8B5CF6',
            }}>
            ✦ Open Source & Transparent
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Built with</span>
            {' '}
            <span style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>❤️ & AI</span>
          </h1>
          <p className="mt-4 text-sm font-medium opacity-50 max-w-lg mx-auto leading-relaxed">
            This application stands on the shoulders of giants.
            Here's everything that powers this experience.
          </p>
        </div>

        {/* Credits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {CREDITS.map((section, si) => (
            <div key={si}
              className="rounded-3xl p-6 transition-all duration-300 hover:scale-[1.01] animate-fade-in"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
                animationDelay: `${si * 0.1}s`,
              }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: `${section.color}15`, border: `1px solid ${section.color}30` }}>
                  {section.icon}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Category</p>
                  <h3 className="font-black text-lg" style={{ color: section.color }}>
                    {section.category}
                  </h3>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {section.items.map((item, ii) => (
                  <div key={ii} className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-all"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: section.color }} />
                      <span className="text-sm font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold opacity-40">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="rounded-3xl p-8 text-center relative overflow-hidden animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1), rgba(6,182,212,0.08))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)',
            }} />
          <span className="text-4xl mb-4 block">🚀</span>
          <h2 className="text-2xl font-black mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
            Ready to create?
          </h2>
          <p className="text-sm font-medium opacity-50 mb-6">
            Start a new conversation and experience the power of Gemini AI.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 rounded-2xl font-black text-sm text-white uppercase tracking-widest transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              boxShadow: '0 6px 24px rgba(139,92,246,0.35)',
            }}
          >
            Start Chatting →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Credits;

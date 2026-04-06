import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUSES = [
  { text: "Initializing Gemini AI…", color: "#8B5CF6" },
  { text: "Securing connection…",     color: "#6366F1" },
  { text: "Syncing chat history…",    color: "#3B82F6" },
  { text: "Optimizing workspace…",    color: "#06B6D4" },
  { text: "Almost there…",            color: "#10B981" },
];

/* Floating orbital ring */
const Ring = ({ size, border, duration, delay = 0, color }) => (
  <div className="absolute rounded-full pointer-events-none"
    style={{
      width: size, height: size,
      border: `${border}px solid ${color}`,
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: `spin-slow ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.15,
    }} />
);

const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const prog = setInterval(() => setProgress(p => (p < 100 ? p + 1.25 : 100)), 100);
    const stat = setInterval(() => setStatusIdx(i => (i + 1) % STATUSES.length), 1600);
    const nav  = setTimeout(() => navigate('/'), 8000);
    return () => { clearInterval(prog); clearInterval(stat); clearTimeout(nav); };
  }, [navigate]);

  const current = STATUSES[statusIdx];

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0f0a1e 0%, #080810 60%, #020204 100%)' }}>

      {/* ── Ambient orbs ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 10s ease-in-out infinite',
          }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 12s ease-in-out infinite reverse',
          }} />
        <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '4s',
          }} />
      </div>

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

      {/* ── Central loader ── */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-8 max-w-sm w-full">

        {/* Orbital rings + core */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <Ring size="170px" border={1} duration={12} color="#8B5CF6" />
          <Ring size="140px" border={1} duration={8}  color="#3B82F6" delay={-2} />
          <Ring size="115px" border={1} duration={5}  color="#06B6D4" delay={-1} />

          {/* Spinning gradient arc */}
          <div className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #8B5CF6, #6366F1, #3B82F6, #06B6D4, transparent 65%)',
              animation: 'spin-slow 2.5s linear infinite',
              WebkitMask: 'radial-gradient(circle, transparent 52%, black 53%)',
              mask: 'radial-gradient(circle, transparent 52%, black 53%)',
              filter: 'blur(1px)',
            }} />

          {/* Core pulsing dot */}
          <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              boxShadow: `0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.3)`,
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}>
            <span className="text-2xl">✦</span>
          </div>
        </div>

        {/* Text area */}
        <div className="text-center space-y-4 w-full">
          <div className="h-8 flex items-center justify-center">
            <h2 className="text-lg font-black tracking-widest uppercase transition-all duration-500"
              style={{ color: current.color }}>
              {current.text}
            </h2>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="h-[3px] w-full rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, #8B5CF6, #6366F1, #3B82F6, #06B6D4)`,
                  backgroundSize: '200% 100%',
                  animation: 'gradient-flow 2s ease infinite',
                  boxShadow: '0 0 10px rgba(139,92,246,0.5)',
                }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-25">
              Loading · {Math.round(progress)}%
            </p>
          </div>

          {/* Dot progress indicators */}
          <div className="flex justify-center gap-2 mt-2">
            {STATUSES.map((s, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{
                  width: i === statusIdx ? '24px' : '6px',
                  height: '6px',
                  background: i <= statusIdx ? s.color : 'rgba(255,255,255,0.1)',
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="absolute bottom-8 flex flex-col items-center gap-1.5 opacity-20">
        <div className="w-12 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,1), transparent)' }} />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white">
          AI Interface · v3.0
        </p>
      </div>
    </div>
  )
}

export default Loading;
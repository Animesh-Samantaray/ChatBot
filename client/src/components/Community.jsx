import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

/* Shimmer skeleton for loading */
const Skeleton = () => (
  <div className="aspect-square rounded-3xl overflow-hidden relative"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s infinite',
      }} />
  </div>
);

const ACCENT_COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];

const Community = () => {
  const { theme } = useAppContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => {
      setImages(dummyPublishedImages || []);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex-1 h-screen overflow-y-auto custom-scrollbar transition-all duration-500"
      style={{ background: isDark ? 'transparent' : '#f5f3ff' }}>
      <div className="p-6 md:p-10 xl:px-20 2xl:px-32 w-full mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 rounded-full"
              style={{ background: 'linear-gradient(180deg, #8B5CF6, #3B82F6)' }} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50">
              Community Showcase
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI Generated</span>
            {' '}
            <span style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Gallery</span>
          </h1>
          <p className="mt-3 text-sm font-medium max-w-lg leading-relaxed"
            style={{ color: isDark ? '#64748b' : '#6b7280' }}>
            Explore stunning images created by our community using Gemini's image generation.
          </p>
        </div>

        {/* Stats bar */}
        {!loading && images.length > 0 && (
          <div className="flex items-center gap-6 mb-8 animate-slide-left">
            {[
              { label: 'Images', value: images.length, color: '#8B5CF6' },
              { label: 'Creators', value: new Set(images.map(i => i.userName)).size, color: '#3B82F6' },
              { label: 'This week', value: Math.floor(images.length * 0.4), color: '#06B6D4' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-2xl font-black" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs font-semibold opacity-40 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {images.map((image, index) => {
              const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
              const isHovered = hoveredIdx === index;
              return (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-3xl cursor-pointer transition-all duration-500"
                  style={{
                    background: isDark ? '#1a1a2e' : '#f1f0ff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: isHovered ? `0 20px 48px ${accent}30` : '0 2px 12px rgba(0,0,0,0.06)',
                    transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Gradient border accent on top */}
                  <div className="absolute top-0 inset-x-0 h-[2px] z-10 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      opacity: isHovered ? 1 : 0,
                    }} />

                  <img
                    src={image.imageUrl}
                    alt={`Community ${index}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 transition-opacity duration-300 flex flex-col justify-end p-5"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)`,
                      opacity: isHovered ? 1 : 0,
                    }}>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-bold truncate mb-1 opacity-80">
                          {image.userName || 'Anonymous'}
                        </p>
                        <button
                          className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all hover:scale-105"
                          style={{
                            background: `${accent}25`,
                            border: `1px solid ${accent}50`,
                            color: '#fff',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          View Prompt
                        </button>
                      </div>
                      <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg"
                        style={{ background: `${accent}30`, border: `1px solid ${accent}40` }}>
                        ✨
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-in">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-4xl"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.08)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.15)'}`,
              }}>
              🖼️
            </div>
            <h3 className="text-xl font-black mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
              No images yet
            </h3>
            <p className="text-sm font-medium opacity-50">Be the first to publish an AI masterpiece!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;
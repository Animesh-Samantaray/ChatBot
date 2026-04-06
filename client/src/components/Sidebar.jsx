import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment';
import api from '../axios';
import toast from 'react-hot-toast';

/* ─── Color accent pool for chat items ─── */
const ACCENT_COLORS = [
  { dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
  { dot: '#3B82F6', glow: 'rgba(59,130,246,0.15)' },
  { dot: '#06B6D4', glow: 'rgba(6,182,212,0.15)' },
  { dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
  { dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  { dot: '#F43F5E', glow: 'rgba(244,63,94,0.15)' },
];

function Sidebar({ isMenuOpen, setIsMenuOpen }) {
    const { chats, setChats, selectedChat, setSelectedChat, theme, navigate, setTheme, user, setUser, createNewChat } = useAppContext();
    const [search, setSearch] = useState('');
    const [hoveredChat, setHoveredChat] = useState(null);

    const logout = async () => {
        try {
            const { data } = await api.post('/user/logout');
            if (data.success) toast.success('Logged out successfully');
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            setUser(null);
            setChats([]);
            setSelectedChat(null);
            setSearch('');
            navigate('/login');
        }
    }

    const deleteChat = async (e, chatId) => {
        e.stopPropagation();
        const isConfirmed = window.confirm('Delete this conversation?');
        if (!isConfirmed) return;
        try {
            const { data } = await api.post('/chat/delete', { chatId });
            if (data.success) {
                setChats(prev => prev.filter(c => c._id !== chatId));
                if (selectedChat?._id === chatId) setSelectedChat(null);
                toast.success("Conversation deleted");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    }

    const filteredChats = chats?.filter((chat) => {
        if (!chat) return false;
        if (search.trim() === '') return true;
        const q = search.toLowerCase();
        const msgMatch = chat.messages?.length > 0 && chat.messages[0].content.toLowerCase().includes(q);
        const nameMatch = (chat.name || "").toLowerCase().includes(q);
        return msgMatch || nameMatch;
    });

    return (
        <>
            {/* ── Overlay (mobile) ── */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <aside className={`
                relative flex flex-col h-screen w-[280px] min-w-[280px]
                border-r border-white/[0.07] z-50
                transition-all duration-500 ease-in-out
                max-md:fixed max-md:left-0 max-md:top-0
                ${!isMenuOpen ? 'max-md:-translate-x-full' : ''}
                overflow-hidden
            `}
                style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(180deg, #0f0f1a 0%, #0d0d14 100%)'
                        : 'linear-gradient(180deg, #fdfcff 0%, #f8f6ff 100%)',
                }}
            >
                {/* ── Rainbow border top accent ── */}
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, #8B5CF6, #6366F1, #3B82F6, #06B6D4)' }} />

                {/* ── Interior radial glow (dark only) ── */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }} />

                <div className="flex flex-col h-full p-5 gap-4 relative z-10">

                    {/* ── Logo ── */}
                    <div className="flex items-center justify-between mb-2 pt-2">
                        <img
                            src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark}
                            alt="Logo"
                            className="h-8 object-contain cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-[1.03]"
                        />
                        <button
                            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* ── New Chat Button ── */}
                    <button
                        onClick={createNewChat}
                        className="group relative flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)',
                            backgroundSize: '200% 200%',
                            boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
                        }}
                    >
                        {/* shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="text-xl group-hover:rotate-90 transition-transform duration-300 font-light">+</span>
                        New Conversation
                    </button>

                    {/* ── Search ── */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200"
                        style={{
                            background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        }}
                    >
                        <svg className="w-4 h-4 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder="Search conversations..."
                            className="w-full bg-transparent text-sm outline-none font-medium placeholder:opacity-40"
                            style={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b' }}
                        />
                    </div>

                    {/* ── Chat List ── */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {filteredChats?.length > 0 && (
                            <div className="flex items-center gap-2 px-2 mb-3">
                                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)' }} />
                                <p className="text-[10px] font-black uppercase tracking-widest"
                                    style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)' }}>
                                    Recent
                                </p>
                                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3))' }} />
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                            {filteredChats?.map((chat, idx) => {
                                const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                                const isActive = selectedChat?._id === chat._id;
                                const isHovered = hoveredChat === chat._id;
                                const chatTitle = chat.messages?.length > 0
                                    ? chat.messages[0].content.slice(0, 34)
                                    : (chat.name || "New Conversation");

                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false); }}
                                        onMouseEnter={() => setHoveredChat(chat._id)}
                                        onMouseLeave={() => setHoveredChat(null)}
                                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'chat-item-active' : ''}`}
                                        style={{
                                            background: isActive
                                                ? `linear-gradient(135deg, ${accent.glow}, rgba(59,130,246,0.06))`
                                                : isHovered
                                                    ? (theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')
                                                    : 'transparent',
                                            border: isActive ? `1px solid ${accent.dot}30` : '1px solid transparent',
                                        }}
                                    >
                                        <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                                            {/* Color dot */}
                                            <div className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ background: accent.dot, boxShadow: isActive ? `0 0 6px ${accent.dot}` : 'none' }} />
                                            <div className="flex flex-col truncate flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate"
                                                    style={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                                                    {chatTitle}
                                                </p>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                                                    style={{ color: theme === 'dark' ? '#475569' : '#94a3b8' }}>
                                                    {moment(chat.updatedAt).fromNow()}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => deleteChat(e, chat._id)}
                                            className="ml-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/15 hover:scale-110"
                                        >
                                            <img src={assets.bin_icon} className="w-3.5 h-3.5 not-dark:invert" alt="delete" />
                                        </button>
                                    </div>
                                );
                            })}

                            {filteredChats?.length === 0 && search && (
                                <div className="text-center py-8">
                                    <p className="text-2xl mb-2">🔍</p>
                                    <p className="text-xs font-semibold opacity-40">No results found</p>
                                </div>
                            )}

                            {!user && chats?.length === 0 && (
                                <div className="text-center py-6 px-4">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed"
                                        style={{ color: theme === 'dark' ? '#475569' : '#94a3b8' }}>Sign in to save your<br/>conversations</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Bottom Section ── */}
                    <div className="space-y-2 pt-4 mt-auto"
                        style={{ borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>

                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-xl transition-all"
                            style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ background: theme === 'dark' ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)' }}>
                                    <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
                                </div>
                                <span className="text-sm font-semibold"
                                    style={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}>
                                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer"
                                    checked={theme === 'dark'}
                                    onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                                <div className="w-11 h-6 rounded-full transition-all duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all after:shadow-md"
                                    style={{
                                        background: theme === 'dark'
                                            ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                                            : 'rgba(0,0,0,0.15)',
                                    }} />
                            </label>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 hover:scale-[1.01]"
                            style={{
                                background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
                            }}>

                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-9 h-9 rounded-xl overflow-hidden p-[1.5px]"
                                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
                                    <div className="w-full h-full rounded-[10px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <img src={assets.user_icon} className="w-full h-full object-cover" alt="user" />
                                    </div>
                                </div>
                                {user && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                                        style={{
                                            background: '#10B981',
                                            borderColor: theme === 'dark' ? '#0f0f1a' : '#fdfcff',
                                        }} />
                                )}
                            </div>

                            <div className="flex-1 min-w-0 flex items-center justify-between">
                                {user ? (
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold truncate"
                                            style={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] font-semibold opacity-40">Online</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-sm font-bold transition-colors"
                                        style={{ color: '#8B5CF6' }}
                                    >
                                        Sign In →
                                    </button>
                                )}

                                {user && (
                                    <button
                                        onClick={logout}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:bg-red-500/15 hover:scale-110"
                                        title="Logout"
                                    >
                                        <img src={assets.logout_icon} className="w-4 h-4 not-dark:invert opacity-60 hover:opacity-100" alt="logout" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;
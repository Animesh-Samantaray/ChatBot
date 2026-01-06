import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment';
import api from '../axios';
import toast from 'react-hot-toast';

function Sidebar({ isMenuOpen, setIsMenuOpen }) {
    const { chats, setChats, selectedChat, setSelectedChat, theme, navigate, setTheme, user, setUser, createNewChat } = useAppContext();
    const [search, setSearch] = useState('');

    // 1. Safe Logout Function
    const logout = async () => {
        try {
            const { data } = await api.post('/user/logout');
            if (data.success) {
                toast.success('Logout successfully');
            }
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            setUser(null);
            setChats([]);
            setSelectedChat(null);
            setSearch('');
            navigate('/');
        }
    }

    // 2. Delete Chat Logic
    const deleteChat = async (e, chatId) => {
        e.stopPropagation(); 
        const isConfirmed = window.confirm('Do you want to delete this chat?');
        if (!isConfirmed) return;

        try {
            const { data } = await api.post('/chat/delete', { chatId });
            
            if (data.success) {
                setChats(prev => prev.filter(chat => chat._id !== chatId));
                if (selectedChat && selectedChat._id === chatId) {
                    setSelectedChat(null);
                }
                toast.success("Chat deleted");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    }

    return (
        <div className={`flex flex-col h-screen min-w-[300px] max-w-[300px] p-6 
            bg-[#f9f9f9] dark:bg-[#121212] 
            border-r border-gray-200 dark:border-white/10 
            transition-all duration-500 ease-in-out max-md:absolute left-0 z-50 ${!isMenuOpen && 'max-md:-translate-x-full'} `}>
            
            {/* Logo */}
            <div className="flex items-center mb-8 px-2">
                <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt='Logo' className='w-40 object-contain hover:opacity-80 transition-opacity cursor-pointer'/>
            </div>

            {/* New Chat Button */}
            <button 
                onClick={createNewChat} 
                className='flex items-center justify-center gap-2 w-full py-3 mb-6 
                text-white font-medium bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] 
                rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 
                active:scale-[0.98] transition-all duration-200 cursor-pointer group'>
                <span className='text-2xl group-hover:rotate-90 transition-transform duration-300'>+</span> 
                New Chat
            </button>

            {/* Search Bar */}
            <div className='flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-purple-400 dark:focus-within:border-purple-500/50 transition-all'>
                <img src={assets.search_icon} className='w-4 opacity-50 not-dark:invert' alt="search" />
                <input 
                    type="text" 
                    onChange={(e) => setSearch(e.target.value)} 
                    value={search} 
                    placeholder='Search conversations...' 
                    className='w-full bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder:text-gray-400'/>
            </div>

            {/* Chat List */}
            <div className='flex flex-col flex-1 mt-6 overflow-hidden'>
                {chats?.length > 0 && (
                    <p className='px-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
                        Recent Activity
                    </p>
                )}

                <div className='flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar'>
                    {chats?.filter((chat) => {
                            if (!chat) return false; 
                            
                            // Check if search is empty
                            if (search.trim() === '') return true;

                            const query = search.toLowerCase();
                            
                            // Check messages safely
                            const hasMessageMatch = chat.messages && 
                                                  chat.messages.length > 0 && 
                                                  chat.messages[0].content.toLowerCase().includes(query);
                            
                            // Check name safely
                            const chatName = chat.name || "New Chat";
                            const hasNameMatch = chatName.toLowerCase().includes(query);
                            
                            return hasMessageMatch || hasNameMatch;
                        })
                        .map((chat) => (
                            <div key={chat._id} 
                                onClick={() => {
                                    navigate('/');
                                    setSelectedChat(chat);
                                    setIsMenuOpen(false);
                                }}
                                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 
                                ${selectedChat?._id === chat._id 
                                    ? 'bg-purple-100/50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30' 
                                    : 'hover:bg-gray-200/50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10'}`} >
                                
                                <div className='flex flex-col truncate flex-1'>
                                    <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>
                                        {/* Display 'New Chat' if messages are empty */}
                                        {chat.messages && chat.messages.length > 0 
                                            ? chat.messages[0].content.slice(0, 32) 
                                            : (chat.name || "New Chat")}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold tracking-tighter">
                                        {moment(chat.updatedAt).fromNow()}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={(e) => deleteChat(e, chat._id)}
                                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                >
                                    <img src={assets.bin_icon} className="w-4 h-4 not-dark:invert hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 space-y-2 border-t border-gray-200 dark:border-white/10">
                
                {/* Theme Toggle */}
                <div className='flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5'>
                    <div className='flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        <img src={assets.theme_icon} className='w-4 not-dark:invert opacity-70' alt="theme" />
                        <span>Dark Mode</span>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                        <input type="checkbox" className='sr-only peer' checked={theme === 'dark'}
                            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                        <div className='w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-purple-600 transition-all after:content-[""] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5'></div>
                    </label>
                </div>

                {/* Profile */}
                <div className='flex items-center gap-3 p-3 mt-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-transparent border border-gray-200 dark:border-white/10 group cursor-pointer'>
                    <div className="relative">
                        <img src={assets.user_icon} className='w-9 h-9 rounded-full ring-2 ring-purple-500/20' alt="user" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                    </div>
                    <div className='flex flex-1 items-center justify-between min-w-0'>
                        {/* FIX: Use standard button or text instead of undefined <Button> */}
                        {user ? (
                            <p className='text-sm font-semibold text-gray-800 dark:text-gray-200 truncate'>
                                {user.name}
                            </p>
                        ) : (
                            <button 
                                onClick={() => navigate('/login')}
                                className='text-sm font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors'
                            >
                                Sign In
                            </button>
                        )}
                        
                        {user && (
                            <img 
                                src={assets.logout_icon} 
                                onClick={logout} 
                                className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 not-dark:invert' 
                            />
                        )}
                    </div>
                </div>
            </div>

            <img src={assets.close_icon} alt="" className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' onClick={()=>{setIsMenuOpen(false)}} />
        </div>
    )
}

export default Sidebar;
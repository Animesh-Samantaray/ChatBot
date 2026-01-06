import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment';

function Sidebar({isMenuOpen , setIsMenuOpen}) {
    const { chats, selectedChat, setSelectedChat, theme, navigate, setTheme, user } = useAppContext();
    const [search, setSearch] = useState('');

    return (
        <div className={`flex flex-col h-screen min-w-[300px] max-w-[300px] p-6 
            bg-[#f9f9f9] dark:bg-[#121212] 
            border-r border-gray-200 dark:border-white/10 
            transition-all duration-500 ease-in-out max-md:absolute left-0 z-50 ${!isMenuOpen &&  'max-md:-translate-x-full'} `}>
            
            {/* Logo Section */}
            <div className="flex items-center mb-8 px-2">
                <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt='Logo' className='w-40 object-contain hover:opacity-80 transition-opacity cursor-pointer'/>
            </div>

            {/* Action Button: New Chat */}
            <button className='flex items-center justify-center gap-2 w-full py-3 mb-6 
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

            {/* Chat List Section */}
            <div className='flex flex-col flex-1 mt-6 overflow-hidden'>
                {chats.length > 0 && (
                    <p className='px-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
                        Recent Activity
                    </p>
                )}

                <div className='flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar'>
                    {chats.filter((chat) => chat.messages ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase()))
                        .map((chat) => (
                            <div key={chat._id} 
                            onClick={()=>{
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
                                        {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold tracking-tighter">
                                        {moment(chat.updatedAt).fromNow()}
                                    </p>
                                </div>
                                <img src={assets.bin_icon} className="opacity-0 group-hover:opacity-100 w-4 h-4 hover:scale-110 transition-all duration-200 not-dark:invert" />
                            </div>
                        ))}
                </div>
            </div>

            {/* Bottom Navigation Section */}
            <div className="mt-auto pt-6 space-y-2 border-t border-gray-200 dark:border-white/10">
                
             
                {/* <div onClick={() => {navigate('/community');setIsMenuOpen(false);}} className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-200/50 dark:hover:bg-white/5 cursor-pointer transition-all group'>
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                        <img src={assets.gallery_icon} className='w-4 not-dark:invert' alt="community" />
                    </div>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Community Images</span>
                </div>

              
                <div onClick={() => navigate('/credits')} className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-200/50 dark:hover:bg-white/5 cursor-pointer transition-all group'>
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors">
                        <img src={assets.diamond_icon} className='w-4 dark:invert' alt="credits" />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-sm font-bold text-gray-700 dark:text-gray-300'>Credits: {user?.credits || 0}</span>
                        <span className='text-[10px] text-purple-500 font-bold uppercase tracking-tighter'>Get More</span>
                    </div>
                </div> */}

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

                {/* User Profile */}
                <div className='flex items-center gap-3 p-3 mt-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-transparent border border-gray-200 dark:border-white/10 group cursor-pointer'>
                    <div className="relative">
                        <img src={assets.user_icon} className='w-9 h-9 rounded-full ring-2 ring-purple-500/20' alt="user" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                    </div>
                    <div className='flex flex-1 items-center justify-between min-w-0'>
                        <p className='text-sm font-semibold text-gray-800 dark:text-gray-200 truncate'>
                            {user ? user.name : 'Sign In'}
                        </p>
                        {user && <img src={assets.logout_icon} className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 not-dark:invert' />}
                    </div>
                </div>

            </div>

<img src={assets.close_icon} alt="" className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' onClick={()=>{setIsMenuOpen(false)}} />

        </div>
    )
}

export default Sidebar;
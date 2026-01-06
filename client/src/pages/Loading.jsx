import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        "Initializing Gemini 3...",
        "Securing Connection...",
        "Syncing Chat History...",
        "Optimizing Workspace...",
        "Almost there..."
    ];

    useEffect(() => {
        // 1. Progress Bar Logic
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1.25 : 100));
        }, 100);

        // 2. Status Message Rotation
        const statusInterval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statuses.length);
        }, 1600);

        // 3. Navigation after 8 seconds
        const timeout = setTimeout(() => {
            navigate('/');
        }, 8000);

        return () => {
            clearInterval(interval);
            clearInterval(statusInterval);
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <div className='relative flex flex-col items-center justify-center h-screen w-screen bg-[#0F0F0F] overflow-hidden font-sans'>
            
            {/* Background Aurora Effect */}
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 flex flex-col items-center max-w-sm w-full px-6'>
                
                {/* 1. The Main Animated Loader */}
                <div className='relative mb-12'>
                    {/* Outer Glow Ring */}
                    <div className='absolute inset-[-15px] rounded-full border border-white/5 animate-[spin_4s_linear_infinite]'></div>
                    
                    {/* Middle Pulsing Ring */}
                    <div className='absolute inset-[-8px] rounded-full border-2 border-purple-500/20 animate-ping'></div>

                    {/* Inner Spinning Circle */}
                    <div className='w-20 h-20 rounded-full border-[3px] border-white/10 border-t-purple-500 animate-spin shadow-[0_0_30px_rgba(168,85,247,0.4)]'></div>
                </div>

                {/* 2. Text & Progress Info */}
                <div className='text-center space-y-4 w-full'>
                    <h2 className='text-white text-xl font-black tracking-widest uppercase animate-pulse'>
                        {statuses[statusIndex]}
                    </h2>
                    
                    <p className='text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase'>
                        System Loading • {Math.round(progress)}%
                    </p>

                    {/* 3. Sleek Progress Bar */}
                    <div className='h-[2px] w-full bg-white/5 rounded-full overflow-hidden mt-2'>
                        <div 
                            className='h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Footer Brand Info */}
                <div className='absolute bottom-10 flex flex-col items-center opacity-30'>
                    <span className='text-[10px] text-white font-black tracking-[0.4em] uppercase'>
                        AI Interface
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Loading;
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
        <div className='relative flex flex-col items-center justify-center h-screen w-screen gradient-bg-3 overflow-hidden font-sans'>
            
            {/* Background Aurora Effect */}
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pulse floating'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pulse floating' style={{ animationDelay: '1s' }}></div>
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[30%] h-[30%] bg-pink-600/10 blur-[100px] rounded-full pulse' style={{ animationDelay: '2s' }}></div>

            <div className='relative z-10 flex flex-col items-center max-w-sm w-full px-6 fade-in'>
                
                {/* 1. The Main Animated Loader */}
                <div className='relative mb-12 floating'>
                    {/* Outer Glow Ring */}
                    <div className='absolute inset-[-15px] rounded-full glass dark:glass-dark glow-purple animate-[spin_4s_linear_infinite]'></div>
                    
                    {/* Middle Pulsing Ring */}
                    <div className='absolute inset-[-8px] rounded-full glass dark:glass-dark glow-blue animate-ping'></div>

                    {/* Inner Spinning Circle */}
                    <div className='w-20 h-20 rounded-full glass dark:glass-dark border-[3px] border-white/10 border-t-purple-500 animate-spin glow-pink'></div>
                </div>

                {/* 2. Text & Progress Info */}
                <div className='text-center space-y-4 w-full slide-in'>
                    <h2 className='text-white text-xl font-black tracking-widest uppercase rainbow-text pulse'>
                        {statuses[statusIndex]}
                    </h2>
                    
                    <p className='text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-purple-400 transition-colors'>
                        System Loading • {Math.round(progress)}%
                    </p>

                    {/* 3. Sleek Progress Bar */}
                    <div className='h-[2px] w-full glass dark:glass-dark rounded-full overflow-hidden mt-2'>
                        <div 
                            className='h-full gradient-bg transition-all duration-300 ease-out glow-purple'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Footer Brand Info */}
                <div className='absolute bottom-10 flex flex-col items-center opacity-30 fade-in'>
                    <span className='text-[10px] text-white font-black tracking-[0.4em] uppercase rainbow-text hover:scale-105 transition-transform cursor-pointer'>
                        AI Interface
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Loading;
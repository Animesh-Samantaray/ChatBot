import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios.js';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]); 
    const [selectedChat, setSelectedChat] = useState(null);
    // 1. Loading starts as TRUE
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/user/data');
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.log("Not logged in");
            setUser(null);
        } finally {
            // 2. We only turn off loading after we know if user is logged in or not
            setLoading(false);
        }
    };

    const fetchUserChats = async () => {
        try {
            const { data } = await api.get('/chat/get');
            if (data.success) {
                const validChats = data.chats || [];
                setChats(validChats);
                
                // Only set selected chat if one isn't already selected
                if (validChats.length > 0 && !selectedChat) {
                    setSelectedChat(validChats[0]);
                }
            }
        } catch (error) {
            // Only show error if we are actually logged in
            if (user) toast.error("Could not load chats");
        }
    };

    const createNewChat = async () => {
        try {
            if (!user) return toast.error('Login to create new chat');
            
            const { data } = await api.get('/chat/create');
            if (data.success) {
                setChats(prev => [data.chat, ...(prev || [])]);
                setSelectedChat(data.chat);
                navigate('/');
                toast.success("New chat created");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Initial User Fetch
    useEffect(() => {
        fetchUser();
    }, []);

    // Theme Logic
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 3. FIXED CHAT FETCHING LOGIC
    useEffect(() => {
        // If we are still checking if the user is logged in, DO NOT touch the chats
        if (loading) return; 

        if (user) {
            // If user is confirmed logged in, get chats
            fetchUserChats();
        } else {
            // Only clear chats if we are sure there is no user
            setChats([]);
            setSelectedChat(null);
        }
    }, [user, loading]); // Dependency array includes loading now

    const value = { 
        navigate, user, setUser, fetchUser, 
        chats, setChats, selectedChat, setSelectedChat, 
        theme, setTheme, loading, createNewChat, fetchUserChats
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
import axios from 'axios';

const api = axios.create({
    baseURL:'https://chat-bot-bcknd.vercel.app'|| 'http://localhost:3000/api', 
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
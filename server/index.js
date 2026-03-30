import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import connectDB from './configs/db.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allowed origins
        const allowedOrigins = [
            'https://chat-bot-frt.vercel.app', 
            'https://chat-bot-bcknd.vercel.app',
            'https://chatbot-frontend.vercel.app',
            'https://chatbot-backend.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        
        if (process.env.NODE_ENV === 'development') {
            // In development, allow all origins
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,               // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(cookieParser()); 

connectDB();
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
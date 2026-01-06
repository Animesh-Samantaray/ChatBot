import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import connectDB from './configs/db.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // Must match your frontend URL exactly
    credentials: true                // Allow cookies to be sent
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
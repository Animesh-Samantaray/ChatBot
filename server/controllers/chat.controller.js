import Chat from "../models/chat.model.js";


// server/controllers/chat.controller.js


export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chat = await Chat.create({
            userId: userId,
            // 👇 ADD THIS LINE
            userName: req.user.name, // The error says this is required!
            
            name: 'New Chat',
            messages: []
        });

        res.json({
            success: true,
            chat: chat
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getChat = async(req,res)=>{
    try {
        const userId=req.user._id;


        const chats=(await Chat.find({userId})).sort({updatedAt:-1})

        
        return res.json({success:true,chats})
    } catch (error) {
         return res.json({success:true,message:error.message})
    }
}

export const deleteChat = async(req,res)=>{
    try {
        const userId=req.user._id;
        const {chatId} = req.body

        await Chat.deleteOne({
            _id:chatId , userId
        })

        
        return res.json({success:true,chats})
    } catch (error) {
         return res.json({success:true,message:error.message})
    }
}

// server/controllers/chat.controller.js

export const userChats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all chats belonging to this user
        // 2. Sort them so the newest ones are at the top (-1)
        const chats = await Chat.find({ userId: userId }).sort({ updatedAt: -1 });

        // 3. Send them back
        res.json({
            success: true,
            chats: chats 
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
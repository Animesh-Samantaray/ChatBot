import Chat from "../models/chat.model.js";


export const createChat = async(req,res)=>{
    try {
        const userId=req.user._id;


        const chatData={
            userId,
            mesages:[],
            name:'New Chat',
            userName:req.user.name
        }

        await Chat.create(chatData);
        return res.json({success:true,message:'Chat Created'})
    } catch (error) {
         return res.json({success:true,message:error.message})
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
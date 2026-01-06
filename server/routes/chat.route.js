import express from "express";
import auth from "../middlewares/auth.js";
import { createChat, deleteChat, getChat } from "../controllers/chat.controller.js";

const chatRouter=express.Router();

chatRouter.get('/create',auth,createChat);
chatRouter.get('/get',auth,getChat);
chatRouter.post('/delete',auth,deleteChat);


export default chatRouter;
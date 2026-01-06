import express from "express";
import auth from "../middlewares/auth.js";
import { imageMessageController, textMessageController } from "../controllers/message.controller.js";

const messageRouter=express.Router();

messageRouter.post('/text',auth,textMessageController);
messageRouter.post('/image',auth,imageMessageController);



export default messageRouter;
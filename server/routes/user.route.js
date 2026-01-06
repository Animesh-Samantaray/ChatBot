import express from "express";
import { getUserData, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();


userRouter.post('/signup', registerUser); 
userRouter.post('/login', loginUser);
userRouter.post('/logout', auth, logoutUser);
userRouter.get('/data', auth, getUserData);

export default userRouter;
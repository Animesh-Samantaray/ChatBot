import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();


userRouter.post('/signup', registerUser); 
userRouter.post('/login', loginUser);
userRouter.post('/logout', auth, logoutUser);

export default userRouter;
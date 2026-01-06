import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const userData = user.toObject();
        delete userData.password;

        return res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        }).status(201).json({
            success: true,
            message: 'Sign up successful',
            user: userData,
            token 
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide email and password" 
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        const userData = user.toObject();
        delete userData.password;

        return res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 
        }).status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userData,
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
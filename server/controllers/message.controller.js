import axios from 'axios';
import Chat from "../models/chat.model.js";
import User from '../models/user.model.js';
import openai from "../configs/openai.js";
import imagekit from "../configs/imagekit.js";

// Controller for Text Messages
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        // Push User Message
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        const response = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
        });

        const reply = {
            role: response.choices[0].message.role,
            content: response.choices[0].message.content,
            timestamp: Date.now(),
            isImage: false
        };

        chat.messages.push(reply);
        await chat.save();

        return res.json({ success: true, reply });

    } catch (error) {
        console.error("Text Chat Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Controller for Image Messages
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { prompt, chatId } = req.body;

        if (!prompt || !chatId) {
            return res.status(400).json({ success: false, message: "Prompt and Chat ID are required" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        // 1. Add user prompt to chat history
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false // The user's prompt is text, the reply is the image
        });

        // 2. Generate Image using ImageKit URL-based generation
        const encodedPrompt = encodeURIComponent(prompt);
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h=800`;

        // 3. Fetch the image data
        console.log(generatedImageUrl);
        
        const aiImageResponse = await axios.get(generatedImageUrl, {
            responseType: 'arraybuffer'
        });

        // 4. Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

        // 5. Upload to ImageKit Storage for a permanent URL
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `ai_gen_${Date.now()}.png`,
            folder: "quickgpt"
        });

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true
        };

        // 6. Push reply and SAVE before sending response
        chat.messages.push(reply);
        await chat.save();

        return res.json({ success: true, reply });

    } catch (error) {
        console.error("Image Gen Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to generate image" });
    }
}
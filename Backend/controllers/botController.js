import { GoogleGenerativeAI } from "@google/generative-ai";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
import buildBotPrompt from "../Utils/builBotPrompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.userId;

        // fetch menu + order history in parallel
        const [foodList, orderHistory] = await Promise.all([
            foodModel.find({}),
            orderModel.find({ userId }).sort({ date: -1 }).limit(10)
        ]);

        const prompt = buildBotPrompt(foodList, orderHistory, message);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text   = result.response.text();

        // clean any markdown fences gemini sometimes adds
        const clean  = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        res.json({ success: true, data: parsed });
    } catch (error) {
        console.error("Bot error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { chat };
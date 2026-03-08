import express from "express";
import { chat } from "../controllers/botController.js";
import authMiddleware from "../middleware/auth.js";

const botRouter = express.Router();

botRouter.post("/chat", authMiddleware, chat);

export default botRouter;
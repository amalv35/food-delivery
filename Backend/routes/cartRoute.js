import express from "express";
import { addToCart,removeFromCart,getCartItems,clearCartItem } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post('/add',authMiddleware, addToCart);
cartRouter.post('/remove', authMiddleware, removeFromCart);
cartRouter.get('/items', authMiddleware, getCartItems);
cartRouter.post('/clear', authMiddleware, clearCartItem);

export default cartRouter;
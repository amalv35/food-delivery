import express from "express";
import {
  placeorder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrderHandler,
  getRevenue,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/add", authMiddleware, placeorder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/delete", deleteOrderHandler);
orderRouter.get("/revenue", getRevenue);

export default orderRouter;

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import passport from "./config/passport.js";
import botRouter from "./routes/botRoute.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(helmet());
app.use(mongoSanitize());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
});

const botLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many bot requests, slow down!" },
});

app.use(passport.initialize());

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// db config
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", authLimiter, userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/bot", botLimiter, botRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

import express from "express";
import { loginUser, registerUser } from "../controllers/userCotroller.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Google OAuth
userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/?error=google_failed`,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/success?token=${token}`,
    );
  },
);

export default userRouter;

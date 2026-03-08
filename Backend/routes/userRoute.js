import express from "express";
import { loginUser, registerUser } from "../controllers/userCotroller.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//redirect to Google login page
userRouter.get("/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

//Google redirects back here after login
userRouter.get("/auth/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:5173/?error=google_failed"
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET
        );
        res.redirect(`http://localhost:5173/auth/success?token=${token}`);
    }
);

export default userRouter;
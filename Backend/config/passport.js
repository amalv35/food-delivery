import 'dotenv/config';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  "/api/user/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // check if user already exists
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
            // create new user from Google profile
            user = await userModel.create({
                name:       profile.displayName,
                email:      profile.emails[0].value,
                password:   "google-auth",   // placeholder
                googleId:   profile.id,
            });
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

export default passport;
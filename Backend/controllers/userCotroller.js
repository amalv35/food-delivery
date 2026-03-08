import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a valid email" });
  }

  try {
    const user = await userModel.findOne({
      email: validator.normalizeEmail(email),
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.password === "google-auth") {
      return res
        .status(400)
        .json({ success: false, message: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : error.message,
    });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a valid email" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 8 characters",
      });
  }

  const cleanName = validator.trim(validator.escape(name));

  try {
    const existingUser = await userModel.findOne({
      email: validator.normalizeEmail(email),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new userModel({
      name: cleanName,
      email: validator.normalizeEmail(email),
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : error.message,
    });
  }
};

export { loginUser, registerUser };

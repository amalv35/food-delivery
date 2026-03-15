import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, please login again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decode.exp && Date.now() >= token_decode.exp * 1000) {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    }

    req.userId = token_decode.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid token, please login again" });
  }
};

export default authMiddleware;

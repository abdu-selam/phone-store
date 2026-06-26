const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt");

const protectedRoute = async (req, res, next) => {
  try {
    const { access } = req.cookies || {};
    if (!access)
      return res.status(400).json({
        error: "Token Missed",
      });

    const result = verifyAccessToken(access);
    if (!result.success) {
      if (result.type === "exp")
        return res.status(403).json({
          error: "Expired Token",
        });

      if (result.type === "invalid")
        return res.status(401).json({
          error: "Invalid Token",
        });

      if (result.type === "missed")
        return res.status(400).json({
          error: "Token Missed",
        });
    }

    const user = await User.findById(result.payload.id);
    if (!user)
      return res.status(401).json({
        error: "Invalid Token",
      });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error on protectedRoute middleware (auth.middeware) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  protectedRoute,
};

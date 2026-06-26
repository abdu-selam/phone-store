const jwt = require("jsonwebtoken");
const { JWT_ACCESS, JWT_REFRESH } = require("./env");

const signAccessToken = (payload) => {
  if (!payload) throw new Error("Payload is required");

  return jwt.sign(payload, JWT_ACCESS, {
    expiresIn: "15m",
  });
};

const verifyAccessToken = (token) => {
  if (!token) return { success: false, type: "missed" };
  try {
    const payload = jwt.verify(token, JWT_ACCESS);

    return { success: true, payload };
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return { success: false, type: "exp" };

    if (error.name === "JsonWebTokenError")
      return { success: false, type: "invalid" };
  }
};

const signRefreshToken = (payload) => {
  if (!payload) throw new Error("Payload is required");

  return jwt.sign(payload, JWT_REFRESH, {
    expiresIn: "7d",
  });
};

const verifyRefreshToken = (token) => {
  if (!token) return { success: false, type: "missed" };
  try {
    const payload = jwt.verify(token, JWT_REFRESH);

    return { success: true, payload };
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return { success: false, type: "exp" };

    if (error.name === "JsonWebTokenError")
      return { success: false, type: "invalid" };
  }
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};

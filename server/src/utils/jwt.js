const jwt = require("jsonwebtoken");
const { JWT_ACCESS, JWT_REFRESH } = require("./env");

const signAccessToken = (payload) => {
  if (!payload) throw new Error("Payload is required");

  return jwt.sign(payload, JWT_ACCESS, {
    expiresIn: "15m",
  });
};

const verifyAccessToken = (token) => {
  if (!token) throw new Error("Token is required");

  return jwt.verify(token, JWT_ACCESS);
};

const signRefreshToken = (payload) => {
  if (!payload) throw new Error("Payload is required");

  return jwt.sign(payload, JWT_REFRESH, {
    expiresIn: "7d",
  });
};

const verifyRefreshToken = (token) => {
  if (!token) throw new Error("Token is required");

  return jwt.verify(token, JWT_REFRESH);
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
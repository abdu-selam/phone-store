const { Router } = require("express");
const {
  register,
  verifyEmail,
  login,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const route = Router();

route.post("/register", register);

route.post("/verify-email/:token", verifyEmail);
route.post("/resend-verify", resendVerifyEmail);

route.post("/login", login);

route.post("/forgot-password", forgotPassword);
route.post("/reset-password", resetPassword);

module.exports = route;

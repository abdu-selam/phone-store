const { Router } = require("express");
const {
  register,
  verifyEmail,
  login,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
  resendForgotEmail,
  logout,
  me,
  refresh,
} = require("../controllers/auth.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

const route = Router();

route.post("/register", register);

route.post("/verify-email/:token", verifyEmail);
route.post("/resend-verify", resendVerifyEmail);

route.post("/login", login);

route.post("/forgot-password", forgotPassword);
route.post("/reset-password", resetPassword);
route.post("/resend-forgot", resendForgotEmail);

route.delete("/logout", protectedRoute, logout);

route.get("/me", protectedRoute, me);

route.get("/refresh", refresh);

module.exports = route;

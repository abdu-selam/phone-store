const { Router } = require("express");
const {
  register,
  verifyEmail,
  login,
} = require("../controllers/auth.controller");

const route = Router();

route.post("/register", register);
route.post("/verify-email/:token", verifyEmail);

route.post("/login", login);

module.exports = route;

const { Router } = require("express");
const { register, verifyEmail } = require("../controllers/auth.controller");

const route = Router();

route.post("/register", register);
route.post("/verify-email/:token", verifyEmail);

module.exports = route;

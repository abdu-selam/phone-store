const { Router } = require("express");
const { register } = require("../controllers/auth.controller");

const route = Router();
route.post("/register", register);

module.exports = route;

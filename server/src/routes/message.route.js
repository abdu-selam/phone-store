const { Router } = require("express");
const { sendMessage } = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

const route = Router();

route.use(protectedRoute);

route.post("/", sendMessage);

module.exports = route;

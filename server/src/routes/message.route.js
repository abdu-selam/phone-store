const { Router } = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

const route = Router();

route.use(protectedRoute);

route.post("/", sendMessage);
route.get("/", getMessages);

module.exports = route;

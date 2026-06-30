const { Router } = require("express");
const {
  sendMessage,
  getMessages,
  getSingleMessage,
} = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

const route = Router();

route.use(protectedRoute);

route.post("/", sendMessage);
route.get("/", getMessages);
route.get("/:id", getSingleMessage);

module.exports = route;

const { Router } = require("express");
const {
  createOrder,
  orderCallback,
  deliverOrder,
} = require("../controllers/order.controller");
const { adminRoute } = require("../middlewares/auth.middleware");

const route = Router();

route.post("/", createOrder);
route.post("/verify", orderCallback);
route.put("/:id", adminRoute, deliverOrder);

module.exports = route;

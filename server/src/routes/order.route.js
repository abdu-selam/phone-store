const { Router } = require("express");
const {
  createOrder,
  orderCallback,
  deliverOrder,
  getOrders,
} = require("../controllers/order.controller");
const { adminRoute } = require("../middlewares/auth.middleware");

const route = Router();

route.post("/", createOrder);
route.post("/verify", orderCallback);
route.put("/:id", adminRoute, deliverOrder);

route.get("/", adminRoute, getOrders)

module.exports = route;

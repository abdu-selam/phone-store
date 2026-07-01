const { Router } = require("express");
const {
  createOrder,
  orderCallback,
  deliverOrder,
  getOrders,
  getMyOrders,
  getOrderDetail,
} = require("../controllers/order.controller");
const {
  adminRoute,
  protectedRoute,
} = require("../middlewares/auth.middleware");

const route = Router();

route.post("/", createOrder);
route.post("/verify", orderCallback);
route.put("/:id", adminRoute, deliverOrder);

route.get("/", adminRoute, getOrders);
route.get("/my", protectedRoute, getMyOrders);
route.get("/:id", getOrderDetail);

module.exports = route;

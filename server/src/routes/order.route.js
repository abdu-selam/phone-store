const { Router } = require("express");
const {
  createOrder,
  orderCallback,
} = require("../controllers/order.controller");

const route = Router();

route.post("/", createOrder);
route.post("/verify", orderCallback);

module.exports = route;

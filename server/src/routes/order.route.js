const { Router } = require("express");
const { createOrder } = require("../controllers/order.controller");

const route = Router();

route.post("/", createOrder);

module.exports = route

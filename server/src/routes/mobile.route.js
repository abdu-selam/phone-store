const { Router } = require("express");
const { getAll } = require("../controllers/mobile.controller");

const route = Router();

route.get("/", getAll);

module.exports = route;

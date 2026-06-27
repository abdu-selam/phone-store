const { Router } = require("express");
const { getAll, getOne } = require("../controllers/mobile.controller");

const route = Router();

route.get("/", getAll);
route.get("/:id", getOne);

module.exports = route;

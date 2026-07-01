const { Router } = require("express");
const { adminRoute } = require("../middlewares/auth.middleware");
const { getUsers } = require("../controllers/admin.controller");

const route = Router();

route.use(adminRoute);

route.get("/users", getUsers);

module.exports = route;

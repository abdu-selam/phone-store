const { Router } = require("express");
const { adminRoute } = require("../middlewares/auth.middleware");
const { getUsers, deleteUser } = require("../controllers/admin.controller");

const route = Router();

route.use(adminRoute);

route.get("/users", getUsers);
route.delete("/user/:id", deleteUser);

module.exports = route;

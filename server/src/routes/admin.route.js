const { Router } = require("express");
const { adminRoute } = require("../middlewares/auth.middleware");
const {
  getUsers,
  deleteUser,
  dashboard,
} = require("../controllers/admin.controller");

const route = Router();

route.use(adminRoute);

route.get("/", dashboard);
route.get("/users", getUsers);
route.delete("/user/:id", deleteUser);

module.exports = route;

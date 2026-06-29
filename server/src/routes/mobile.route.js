const { Router } = require("express");
const {
  getAll,
  getOne,
  createPhone,
  updatePhone,
  addWishList,
  removeWishlist,
} = require("../controllers/mobile.controller");
const {
  adminRoute,
  protectedRoute,
} = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

const route = Router();

route.get("/", getAll);
route.get("/:id", getOne);

route.post(
  "/",
  adminRoute,
  upload.fields([
    {
      name: "main",
      maxCount: 1,
    },
    {
      name: "gallary",
      maxCount: 15,
    },
  ]),
  createPhone,
);
route.put("/:id", adminRoute, updatePhone);

route.post("/wish/:id", protectedRoute, addWishList);
route.delete("/wish/:id", protectedRoute, removeWishlist);

module.exports = route;

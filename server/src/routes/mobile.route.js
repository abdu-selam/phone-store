const { Router } = require("express");
const {
  getAll,
  getOne,
  createPhone,
} = require("../controllers/mobile.controller");
const { adminRoute } = require("../middlewares/auth.middleware");
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

module.exports = route;

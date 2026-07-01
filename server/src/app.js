const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { CLIENT_URL } = require("./utils/env");
const authRoute = require("./routes/auth.route");
const mobileRoute = require("./routes/mobile.route");
const messageRoute = require("./routes/message.route");
const orderRoute = require("./routes/order.route");
const adminRoute = require("./routes/admin.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/mobile", mobileRoute);
app.use("/api/message", messageRoute);
app.use("/api/order", orderRoute);
app.use("/api/admin", adminRoute);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      error: err.message,
    });
  }

  next();
});

module.exports = app;

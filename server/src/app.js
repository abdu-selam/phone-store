const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const { CLIENT_URL } = require("./utils/env");
const authRoute = require("./routes/auth.route");
const mobileRoute = require("./routes/mobile.route");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/mobile", mobileRoute);

module.exports = app;

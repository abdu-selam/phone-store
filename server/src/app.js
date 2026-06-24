const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/auth.route");
const { CLIENT_URL } = require("./utils/env");

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

module.exports = app;

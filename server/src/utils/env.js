require("dotenv").config();

const ENV = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URL: process.env.MONGODB_URL,
};

module.exports = ENV;

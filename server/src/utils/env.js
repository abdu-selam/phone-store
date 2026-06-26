require("dotenv").config();

const ENV = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  NODE_ENV: process.env.NODE_ENV,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  JWT_ACCESS: process.env.JWT_ACCESS,
  JWT_REFRESH: process.env.JWT_REFRESH,
};

module.exports = ENV;

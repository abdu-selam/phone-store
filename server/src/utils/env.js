require("dotenv").config();

const ENV = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  NODE_ENV: process.env.NODE_ENV,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  JWT_ACCESS: process.env.JWT_ACCESS,
  JWT_REFRESH: process.env.JWT_REFRESH,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY,
};

module.exports = ENV;

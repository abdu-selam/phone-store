const mongoose = require("mongoose");
const { MONGODB_URL } = require("../utils/env");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
  } catch (error) {
    console.log("Error in connecting DB", error);
    process.exit(1);
  }
};

module.exports = connectDB;

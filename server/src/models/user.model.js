const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    wishlist: [],
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerify: {
      token: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

const User = model(userSchema, "User");

module.exports = User;

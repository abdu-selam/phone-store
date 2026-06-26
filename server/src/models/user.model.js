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
    wishlist: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerify: {
      token: String,
      createdAt: Date,
    },
    refresh: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

module.exports = User;

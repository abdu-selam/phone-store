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
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Mobile",
      },
    ],
    bought: [
      {
        type: Schema.Types.ObjectId,
        ref: "Mobile",
      },
    ],
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
    forgotPassword: {
      token: String,
      createdAt: Date,
    },
    roll: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

module.exports = User;

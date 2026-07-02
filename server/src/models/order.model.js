const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    user: {
      email: String,
      first_name: String,
      last_name: String,
      phone_number: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    currency: {
      type: String,
      enum: ["ETB", "USD"],
      default: "ETB",
    },
    tx_ref: {
      type: String,
      required: true,
      unique: true,
    },
    ref_id: String,
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Mobile",
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "delivered"],
      default: "unpaid",
    },
    paidDate: Date,
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);

module.exports = Order;

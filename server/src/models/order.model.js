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
    currency: {
      type: String,
      enum: ["ETB", "USD"],
      default: "ETB",
    },
    tx_ref: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);

module.exports = Order;

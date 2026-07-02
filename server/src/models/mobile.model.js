const { Schema, model } = require("mongoose");

const mobileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    os: {
      name: {
        type: String,
        enum: ["Android", "ios", "other"],
        required: true,
      },
      detail: {
        type: String,
        required: true,
      },
    },
    memory: {
      storage: {
        type: String,
        required: true,
      },
      ram: {
        type: String,
        required: true,
      },
    },
    camera: {
      main: String,
      selfie: String,
    },
    battery: {
      capacity: String,
      charging: String,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["sold", "available", "pending"],
      default: "available",
    },
    pictures: {
      main: {
        url: String,
        publicId: String,
      },
      gallary: [
        {
          url: String,
          publicId: String,
        },
      ],
    },
  },
  { timestamps: true },
);

const Mobile = model("Mobile", mobileSchema);

module.exports = Mobile;

const nodemailer = require("nodemailer");
const { EMAIL_PASSWORD, EMAIL_USER } = require("../utils/env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

module.exports = transporter;

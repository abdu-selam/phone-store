const { EMAIL_USER } = require("./env");
const transporter = require("../configs/email.config")

const sendEmail = async ({ to, subject, html, text }) => {
  return transporter.sendMail({
    from: `Abdu Phones, ${EMAIL_USER}`,
    to,
    subject,
    html,
    text,
  });
};

module.exports = {
  sendEmail,
};

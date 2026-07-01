const chapa = require("../configs/chapa.config");
const { SERVER_URL, CLIENT_URL } = require("../utils/env");
const { emailValidate } = require("../utils/validate");

const inputExtracter = (req) => {
  const { first_name, last_name, email, phone_number } = req.body || {};

  if (!phone_number)
    return {
      status: false,
      error: "Phone Number Required",
    };

  const tellReg = /^(09|07)\d{8}$/;
  if (!tellReg.test(phone_number))
    return {
      status: false,
      error: "Invalid Phone Number",
    };

  const data = {
    phone_number,
  };
  first_name ? (data[first_name] = first_name) : "";
  last_name ? (data[last_name] = last_name) : "";
  emailValidate(email) ? (data[email] = email) : "";

  return {
    status: true,
    data,
  };
};

const orderInitializer = async (data) => {
  const tx_ref = await chapa.genTxRef();

  const chapaRes = await chapa.initialize({
    ...data,
    currency: "ETB",
    tx_ref: tx_ref,
    callback_url: `${SERVER_URL}/api/verify`,
    return_url: `${CLIENT_URL}/mobiles/order`,
    customization: {
      title: "Abdu Phone Store",
      description: "Pay and get your dreams phone",
    },
  });

  return {
    res: chapaRes,
    tx_ref,
  };
};

module.exports = {
  inputExtracter,
  orderInitializer,
};

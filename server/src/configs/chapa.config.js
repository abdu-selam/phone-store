const { Chapa } = require("chapa-nodejs");
const { CHAPA_SECRET_KEY } = require("../utils/env");

const chapa = new Chapa({
  secretKey: CHAPA_SECRET_KEY,
});

module.exports = chapa;

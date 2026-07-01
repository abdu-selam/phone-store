const emailValidate = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const passwordValidate = (password) => {
  if (password.length < 6) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    return false;
  }

  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    return false;
  }

  return true;
};

const genTxRef = (tx_refs) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split();

  let trx_re = "";
  for (let i = 0; i < 5; i++) {
    const curr = Math.floor(Math.random() * letters.length);
    trx_re += letters[curr];
  }

  trx_re += `-${Date.now()}`;

  if (tx_refs.includes(trx_re)) genTxRef(tx_refs);

  return trx_re;
};

module.exports = {
  emailValidate,
  passwordValidate,
  genTxRef,
};

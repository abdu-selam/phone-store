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

module.exports = {
  emailValidate,
  passwordValidate,
};

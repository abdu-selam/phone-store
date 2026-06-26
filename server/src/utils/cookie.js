const { NODE_ENV } = require("./env");

const accessCookie = (res, token) => {
  res.cookie("access", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : lax,
    maxAge: 15 * 60 * 1000,
  });
};

const refreshCookie = (res, token) => {
  res.cookie("refresh", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : lax,
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  accessCookie,
  refreshCookie,
};

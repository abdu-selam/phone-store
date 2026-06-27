const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt");

const protectedService = async (req) => {
  const { access } = req.cookies || {};
  if (!access)
    return {
      status: false,
      error: "missed",
    };

  const result = verifyAccessToken(access);
  if (!result.success) {
    if (result.type === "exp")
      return {
        status: false,
        error: "exp",
      };

    if (result.type === "invalid")
      return {
        status: false,
        error: "invalid",
      };

    if (result.type === "missed")
      return {
        status: false,
        error: "missed",
      };
  }

  const user = await User.findById(result.payload.id);
  if (!user)
    return {
      status: false,
      error: "invalid",
    };

  return {
    status: true,
    user,
  };
};

module.exports = {
  protectedService,
};

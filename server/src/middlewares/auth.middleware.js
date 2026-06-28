const { protectedService } = require("../services/auth.service");

const protectedRoute = async (req, res, next) => {
  try {
    const result = await protectedService(req);

    if (!result.status) {
      if (result.type === "exp")
        return res.status(403).json({
          error: "Expired Token",
        });

      if (result.type === "invalid")
        return res.status(401).json({
          error: "Invalid Token",
        });

      if (result.type === "missed")
        return res.status(400).json({
          error: "Token Missed",
        });
    }

    req.user = result.user;
    next();
  } catch (error) {
    console.log("Error on protectedRoute middleware (auth.middeware) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const adminRoute = async (req, res, next) => {
  try {
    const result = await protectedService(req);

    if (!result.status) {
      if (result.type === "exp")
        return res.status(403).json({
          error: "Expired Token",
        });

      if (result.type === "invalid")
        return res.status(401).json({
          error: "Invalid Token",
        });

      if (result.type === "missed")
        return res.status(400).json({
          error: "Token Missed",
        });
    }

    const user = result.user;

    if (user.roll !== "admin") {
      return res.status(401).json({
        error: "Forbidden",
      });
    }

    req.user = result.user;
    next();
  } catch (error) {
    console.log("Error on adminRoute middleware (auth.middleware) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  protectedRoute,
  adminRoute,
};

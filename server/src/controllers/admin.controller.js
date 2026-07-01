const User = require("../models/user.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -wishlist -emailVerify -emailVerify -forgotPassword")
      .lean();

    res.status(200).json({
      message: users,
    });
  } catch (error) {
    console.log("Error on getUsers controller (admin.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsers,
};

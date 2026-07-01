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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id)
      return res.status(400).json({
        error: "User id required",
      });

    const user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: "User id required",
      });

    await user.deleteOne();
    res.status(204).json({});
  } catch (error) {
    console.log("Error on deleteUser controller (admin.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsers,
  deleteUser,
};

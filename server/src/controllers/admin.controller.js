const User = require("../models/user.model");
const {
  overview,
  extractSales,
  bestSaledBrands,
  orderStatus,
} = require("../services/admin.service");

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

const dashboard = async (req, res) => {
  try {
    // extract total orders paid + total orders + total count of products + total customers
    const dashboardStat = await overview();

    // extract sales this month for each day, year for each month, => handle week and day sale
    const sales = await extractSales();

    // select best saled brands (by price and by count)
    const bestBrads = await bestSaledBrands();

    // orders status => total order (pending, paid, unpaid), receint orders
    const order = await orderStatus();

    res.status(200).json({
      message: {
        stat: dashboardStat,
        sales,
        bestBrads,
        orderStat: order,
      },
    });
  } catch (error) {
    console.log("Error on dashboard controller (admin.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  dashboard,
};

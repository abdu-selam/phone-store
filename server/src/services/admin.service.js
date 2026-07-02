const Mobile = require("../models/mobile.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const overview = async () => {
  const [sale, orders, available, mobiles, users] = await Promise.all([
    Order.countDocuments({ status: "paid" }),
    Order.countDocuments(),
    Mobile.countDocuments({ status: "available" }),
    Mobile.countDocuments(),
    User.countDocuments({ roll: "user" }),
  ]);

  return {
    sale,
    orders,
    available,
    mobiles,
    users,
  };
};

const extractSales = async () => {
  const timeLimit = Date.now() - 1000 * 3600 * 24 * 365;
  const orders = await Order.find({
    $and: [
      { status: { $in: ["paid", "delivered"] } },
      { paidDate: { $gte: timeLimit } },
    ],
  })
    .select("paidDate price")
    .sort({ paidDate: -1 })
    .lean();

  const oneWeek = Date.now() - 1000 * 3600 * 24 * 7;
  const oneMonth = Date.now() - 1000 * 3600 * 24 * 30;

  const weekOrder = orders.filter((item) => item.paidDate > oneWeek);
  const monthOrder = orders.filter((item) => item.paidDate > oneMonth);

  const todaysRevenue = orders
    .filter((item) => item.paidDate > Date.now() - 1000 * 60 * 60 * 24)
    .reduce((item1, item2) => item1.price + item2.price);

  const thisWeekRevenue = Array.from({ length: 7 }, () => 0);
  for (const item of weekOrder) {
    const index = Math.floor((item.paidDate - oneWeek) * 1000 * 3600 * 24);
    thisWeekRevenue[index] += item.price;
  }

  const thisMonthRevenue = Array.from({ length: 30 }, () => 0);
  for (const item of monthOrder) {
    const index = Math.floor((item.paidDate - oneMonth) * 1000 * 3600 * 24);
    thisMonthRevenue[index] += item.price;
  }

  const thisYearRevenue = Array.from({ length: 12 }, () => 0);
  for (const item of orders) {
    const index = Math.floor(
      (item.paidDate - oneMonth * 12) * 1000 * 3600 * 24 * 30,
    );
    thisYearRevenue[index] += item.price;
  }

  return {
    today: todaysRevenue,
    week: thisWeekRevenue,
    month: thisMonthRevenue,
    year: thisYearRevenue,
  };
};

const bestSaledBrands = async () => {
  const bestCalculator = (sum = 1) =>
    Mobile.aggregate([
      {
        $match: {
          status: "sold",
        },
      },
      {
        $group: {
          _id: "$brand",
          totalSold: { $sum: sum },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
    ]);

  const [count, price] = await Promise.all([
    bestCalculator(),
    bestCalculator("$price"),
  ]);

  return {
    count,
    price,
  };
};

const orderStatus = async () => {
  const [delivered, paid, unpaid] = await Promise.all([
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "paid" }),
    Order.countDocuments({ status: "unpaid" }),
  ]);

  const recent = await Order.find({ status: "paid" })
    .sort({
      createdAt: -1,
    })
    .limit(10);

  return {
    delivered,
    paid,
    unpaid,
    recent,
  };
};

module.exports = {
  overview,
  extractSales,
  bestSaledBrands,
  orderStatus,
};

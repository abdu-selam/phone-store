const Mobile = require("../models/mobile.model");
const Order = require("../models/order.model");
const {
  inputExtracter,
  orderInitializer,
  verifyPayment,
} = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const { products } = req.body || {};
    if (!products)
      return res.status(400).json({
        error: "Products id required",
      });

    if (!Array.isArray(products))
      return res.status(400).json({
        error: "Invalid Products Structure",
      });

    const mobiles = await Mobile.find({
      _id: {
        $in: [...products],
      },
    })
      .select("_id name status price description")
      .lean();

    if (mobiles.length === 0)
      return res.status(400).json({
        error: "Invalid Products Ids",
      });

    const validIds = mobiles.map((item) => item._id);

    const invalids = products
      .filter(
        (item, i) =>
          !validIds.includes(item) ||
          mobiles[validIds.indexOf(item)].status === "sold",
      )
      .map((item) => ({
        id: item,
        reason: !validIds.includes(item) ? "Invalid" : "sold",
      }));

    // accept inputs and validate
    const result = inputExtracter(req);
    if (!result.status)
      return res.status(400).json({
        error: result.error,
      });

    const amount = mobiles
      .filter((item) => item.status === "available")
      .reduce((item1, item2) => item1.price + item2.price);

    result.data.amount = amount + "";

    // request chapa url
    const chapa = await orderInitializer(result.data);

    if (chapa.res.status === "failed") {
      console.log(
        "Error on chapa request order.controller ",
        chapa.res.message,
      );
      return res.status(400).json({
        error: "Payment Request faild",
      });
    }

    delete result.data.amount;
    const order = new Order({
      user: {
        ...result.data,
      },
      tx_ref: chapa.tx_ref,
      products: mobiles
        .filter((item) => item.status === "available")
        .map((item) => item._id),
      price: amount,
    });

    // save order
    await order.save();
    // send url to client
    res.status(201).json({
      message: chapa.res.data.checkout_url,
    });
  } catch (error) {
    console.log("Error on createOrder controller (order.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const orderCallback = async (req, res) => {
  try {
    const { trx_ref, ref_id, status } = req.body;
    if (status === "failed") {
      const order = await Order.findOneAndDelete({ tx_ref: trx_ref });
      return;
    }

    const verify = await verifyPayment(trx_ref);
    if (verify.status === "failed") return;

    const order = await Order.findOne({ tx_ref: trx_ref });
    order.status = "paid";
    await order.save();
  } catch (error) {
    console.log("Error on orderCallback controller (order.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createOrder,
  orderCallback,
};

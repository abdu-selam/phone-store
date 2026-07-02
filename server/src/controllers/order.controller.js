const Mobile = require("../models/mobile.model");
const Order = require("../models/order.model");
const { protectedService } = require("../services/auth.service");
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

    const isAuthUser = await protectedService(req);

    const mobiles = await Mobile.find({
      _id: {
        $in: [...products],
      },
    }).select("_id name status price description");

    if (mobiles.length === 0)
      return res.status(400).json({
        error: "Invalid Products Ids",
      });

    const selectedIds = mobiles.map((item) => item._id);

    const invalids = products
      .filter(
        (item, i) =>
          !selectedIds.includes(item) ||
          mobiles[selectedIds.indexOf(item)].status !== "available",
      )
      .map((item) => ({
        id: item,
        reason: !selectedIds.includes(item) ? "Invalid" : "sold",
      }));

    // accept inputs and validate
    const result = inputExtracter(req);
    if (!result.status)
      return res.status(400).json({
        error: result.error,
      });

    const validIds = mobiles
      .filter((item) => item.status === "available")
      .map((item) => item._id);

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
      userId: isAuthUser.status ? isAuthUser.user._id : null,
    });

    // save order
    await order.save();
    mobiles.forEach(async (mobile) => {
      if (mobile.status === "available") {
        mobile.status = "pending";
        await mobile.save();
      }
    });

    // send url to client
    res.status(201).json({
      message: chapa.res.data.checkout_url,
      valids: validIds,
      invalids: invalids,
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
      const order = await Order.findOne({ tx_ref: trx_ref });
      const mobiles = await Mobile.find({
        _id: {
          $in: [...order.products],
        },
      });

      mobiles.forEach(async (mobile) => {
        mobile.status = "available";
        await mobile.save();
      });

      await order.deleteOne();

      return;
    }

    const verify = await verifyPayment(trx_ref);
    if (verify.status === "failed") return;

    const order = await Order.findOne({ tx_ref: trx_ref });
    const mobiles = await Mobile.find({
      _id: {
        $in: [...order.products],
      },
    });

    mobiles.forEach(async (mobile) => {
      mobile.status = "sold";
      await mobile.save();
    });

    order.status = "paid";
    order.ref_id = ref_id;
    order.paidDate = Date.now();
    await order.save();
  } catch (error) {
    console.log("Error on orderCallback controller (order.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id)
      return res.status(400).json({
        error: "Order id required",
      });

    const order = await Order.findById(id);
    if (!order)
      return res.status(400).json({
        error: "Order id required",
      });

    order.status = "delivered";
    await order.save();

    res.status(200).json({
      message: "Order delivered",
    });
  } catch (error) {
    console.log("Error on deliverOrder controller (order.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const { type } = req.query || {};
    let ordersPromise;
    if (type === "delivered") {
      ordersPromise = Order.find({ status: "delivered" });
    } else if (type === "paid") {
      ordersPromise = Order.find({ status: "paid" });
    } else {
      ordersPromise = Order.find({ status: { $in: ["delivered", "paid"] } });
    }

    const orders = await ordersPromise
      .select("price status tx_ref _id ref_id")
      .lean();

    res.status(200).json({
      message: orders,
    });
  } catch (error) {
    console.log("Error on getOrders controller (order.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $and: [
        { userId: req.user._id },
        { status: { $in: ["paid", "delivered"] } },
      ],
    })
      .select("price status tx_ref _id ref_id")
      .lean();

    res.status(200).json({
      message: orders,
    });
  } catch (error) {
    console.log("Error on getMyOrders controller (order.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id)
      return res.status(400).json({
        error: "Order id required",
      });

    const order = await Order.findById(id)
      .populate([
        { path: "products", select: "name brand price pictures.main _id" },
      ])
      .lean();
    if (!order)
      return res.status(400).json({
        error: "Order id required",
      });

    res.status(200).json({
      message: order,
    });
  } catch (error) {
    console.log(
      "Error on getOrderDetail controller (order.controller) ",
      error,
    );
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createOrder,
  orderCallback,
  deliverOrder,
  getOrders,
  getMyOrders,
  getOrderDetail,
};

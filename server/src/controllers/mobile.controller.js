const Mobile = require("../models/mobile.model");
const { protectedService } = require("../services/auth.service");
const {
  extractFilter,
  mobileQuery,
  availabileFilters,
} = require("../services/mobile.services");
const {
  phoneInputExtract,
  uploadMultiple,
  updateMobile,
} = require("../utils/phoneCreate");

// get all phones with filter and pagenation
const getAll = async (req, res) => {
  try {
    // extract filters
    const result = extractFilter(req);
    // extract products and availabile filters
    const [{ count, mobiles }, filters] = await Promise.all([
      mobileQuery(result),
      availabileFilters(),
    ]);

    // send result
    res.status(200).json({
      message: "Success",
      pages: {
        total: Math.ceil(count / 25),
        current: result.page,
      },
      mobiles,
      filters,
      count,
    });
  } catch (error) {
    console.log("Error on getAll controller (mobile.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// get one phone
const getOne = async (req, res) => {
  try {
    const { id } = req.params || {};

    const mobile = await Mobile.findById(id).lean();
    if (!mobile) return res.status(404).json({ error: "Phone not found" });

    if (mobile.status !== "available") {
      const check = await protectedService(req);
      if (!check.status)
        return res.status(404).json({ error: "Phone not found" });

      if (check.user.roll !== "admin")
        return res.status(404).json({ error: "Phone not found" });
    }

    res.status(200).json({
      mobile,
    });
  } catch (error) {
    console.log("Error on getOne controller (mobile.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// post phone
const createPhone = async (req, res) => {
  try {
    // recieve all inputs
    const result = phoneInputExtract(req);
    if (!result.status)
      return res.status(400).json({
        error: result.error,
      });

    const mobile = new Mobile({
      ...result.data,
    });

    // process the image
    const { main, gallary } = await uploadMultiple(req.files);
    mobile.pictures = {
      gallary:
        gallary.length > 0
          ? gallary.map((img) => ({
              url: img.data.secure_url,
              publicId: img.data.public_id,
            }))
          : null,
      main: main.status
        ? {
            url: main.data.secure_url,
            publicId: main.data.public_id,
          }
        : gallary.length > 0
          ? {
              url: gallary[0].data.secure_url,
              publicId: gallary[0].data.public_id,
            }
          : null,
    };

    // save the product
    await mobile.save();

    res.status(201).json({
      messge: "Phone Created Successfully",
      data: mobile.toObject(),
    });
  } catch (error) {
    console.log("Error on createPhone controller (mobile.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// update phone
const updatePhone = async (req, res) => {
  try {
    // check mobile id
    const { id } = req.params || {};
    if (!id)
      return res.status(401).json({
        error: "Invalid Mobile Id",
      });

    const mobile = await Mobile.findById(id);
    if (!mobile)
      return res.status(401).json({
        error: "Invalid Mobile Id",
      });

    // check inputs
    const result = updateMobile(req, mobile);
    if (!result.status)
      return res.status(401).json({
        error: result.error,
      });

    // save mobile
    await mobile.save();
    // send responce
    res.status(200).json({
      message: "Mobile has been Updated",
      data: mobile.toObject(),
    });
  } catch (error) {
    console.log("Error on update Phone controller (mobile.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// add wishlist
const addWishList = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id)
      return res.status(401).json({
        error: "Invalid Mobile Id",
      });

    const mobile = await Mobile.findById(id);
    if (!mobile)
      return res.status(401).json({
        error: "Invalid Mobile Id",
      });

    req.user.wishlist = [...new Set([...req.user.wishlist, mobile._id])];
    await req.user.save();
    res.status(200).json({
      message: "Mobile has been added to wishlist",
      data: req.user.wishlist,
    });
  } catch (error) {
    console.log("Error on addWishList controller (mobile.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
// remove wishlist
// get wishlists

module.exports = {
  getAll,
  getOne,
  createPhone,
  updatePhone,
  addWishList,
};

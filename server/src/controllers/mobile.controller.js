const Mobile = require("../models/mobile.model");
const { protectedService } = require("../services/auth.service");
const {
  extractFilter,
  mobileQuery,
  availabileFilters,
} = require("../services/mobile.services");

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
// update phone

module.exports = {
  getAll,
  getOne,
};

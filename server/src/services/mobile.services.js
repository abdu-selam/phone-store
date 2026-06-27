const Mobile = require("../models/mobile.model");

const extractFilter = (req) => {
  const { query } = req;
  const result = {
    sort: {},
    filters: [{ status: "available" }],
    page: Math.floor(query?.page) > 1 ? Math.floor(query.page) : 1,
  };

  const sortType = ["createdAt", "name", "price"].includes(query.sort)
    ? query.sort
    : "createdAt";
  result.sort[sortType] = query.order === "asd" ? 1 : -1;
  // os filter
  if (query.os) result.filters.push({ "os.name": { $in: [...query.os] } });

  // storage filters
  if (query.storage)
    result.filters.push({ "memory.storage": { $in: [...query.storage] } });

  // ram filters
  if (query.ram) result.filters.push({ "memory.ram": { $in: [...query.ram] } });

  // brand filters
  if (query.brand) result.filters.push({ brand: { $in: [...query.brand] } });

  // price filter
  if (query.minprice) result.filters.push({ price: { $gte: query.minprice } });

  if (query.maxprice) result.filters.push({ price: { $lte: query.maxprice } });

  return result;
};

const mobileQuery = async ({ filters, sort, page }) => {
  const query = Mobile.find({
    $and: filters,
  })
    .sort(sort)
    .select("name brand price pictures.main")
    .skip(page * 25)
    .limit(25)
    .lean();

  const count = await Mobile.countDocuments({ $and: filters });
  if (page * 25 > count) return { count, mobiles: [] };

  const mobiles = await query.exec();

  return {
    count,
    mobiles,
  };
};

const availabileFilters = async () => {
  const priceRange = Mobile.aggregate([
    {
      $group: {
        _id: null,
        min: { $min: "$price" },
        max: { $max: "$price" },
      },
    },
  ]);

  const [brands, os, storages, rams, [prices = {}]] = await Promise.all([
    Mobile.distinct("brand"),
    Mobile.distinct("os.name"),
    Mobile.distinct("memory.storage"),
    Mobile.distinct("memory.ram"),
    priceRange,
  ]);

  return {
    brands,
    os,
    storages,
    rams,
    prices: {
      min: prices?.min,
      max: prices?.max,
    },
  };
};

module.exports = {
  extractFilter,
  mobileQuery,
  availabileFilters,
};

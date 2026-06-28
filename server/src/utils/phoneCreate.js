const { uploadPromise, deleteFile } = require("../services/cloudinary.service");

// extract all inputs and validate
const phoneInputExtract = (req) => {
  const {
    name,
    description,
    brand,
    osname,
    osdetail,
    storage,
    ram,
    cameramain,
    camerafront,
    batterycapacity,
    batterycharging,
    price,
  } = req.body || {};

  if (
    !name || // *
    !description || // *
    !brand || // *
    !osname || // *
    !osdetail || // *
    !storage || // *
    !ram || // *
    !camerafront || // *
    !cameramain || // *
    !batterycapacity || // *
    !batterycharging || // *
    !price
  ) {
    return {
      status: false,
      error: {
        msg: "All fields required ",
        data: req.body,
      },
    };
  }

  if (!["Android", "ios", "other"].includes(osname))
    return {
      status: false,
      error: "Invalid os type",
    };

  const priceNum = Number(price);

  if (Number.isNaN(priceNum) || priceNum <= 0)
    return {
      status: false,
      error: "Invalid Price",
    };

  return {
    status: true,
    data: {
      name,
      description,
      brand,
      os: {
        name: osname,
        detail: osdetail,
      },
      memory: {
        storage,
        ram,
      },
      camera: {
        main: cameramain,
        selfie: camerafront,
      },
      battery: {
        capacity: batterycapacity,
        charging: batterycharging,
      },
      price: priceNum,
    },
  };
};

// upload all images and return there data
const uploader = async (file, folder = "mobiles") => {
  let uploaded;

  try {
    uploaded = await uploadPromise(file.buffer, folder);

    return {
      status: true,
      data: uploaded,
    };
  } catch (error) {
    if (uploaded?.public_id) {
      await deleteFile(uploaded.public_id);
    }

    return {
      status: false,
      error,
    };
  }
};

const uploadMultiple = async (files) => {
  const main = files.main[0];
  const gallary = files.gallary;

  const mainResult = await uploader(main);
  const gallaryResult =
    gallary?.length > 0
      ? await Promise.all([...gallary.map((file) => uploader(file))])
      : [];

  return {
    main: mainResult,
    gallary: gallaryResult.filter((item) => item.status),
  };
};

module.exports = {
  phoneInputExtract,
  uploader,
  uploadMultiple,
};

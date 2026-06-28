const { uploadPromise, deleteFile } = require("../services/cloudinary.service");

// extract all inputs and validate
const phoneInputExtract = (req) => {
  const { name, description, brand, os, storage, ram, camera, battery, price } =
    req.body || {};

  if (
    !name ||
    !description ||
    !brand ||
    !os?.name ||
    !os?.detail ||
    !storage ||
    !ram ||
    !camera?.front ||
    !camera?.main ||
    !battery?.capacity ||
    !battery?.charging ||
    !price
  ) {
    return {
      status: false,
      error: "All fields required",
    };
  }

  if (!["Android", "ios", "other"].includes(os.name))
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
        name: os.name,
        detail: os.detail,
      },
      memory: {
        storage,
        ram,
      },
      camera: {
        main: camera.main,
        selfie: camera.front,
      },
      battery: {
        capacity: battery.capacity,
        charging: battery.charging,
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
  const gallaryResult = await Promise.all([
    ...gallary.map((file) => uploader(file)),
  ]);

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

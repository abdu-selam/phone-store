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
    !name ||
    !description ||
    !brand ||
    !osname ||
    !osdetail ||
    !storage ||
    !ram ||
    !camerafront ||
    !cameramain ||
    !batterycapacity ||
    !batterycharging ||
    !price
  ) {
    return {
      status: false,
      error: "All fields required ",
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

// extract input for update phone
const updateMobile = (req, mobile) => {
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
    !name &&
    !description &&
    !brand &&
    !osname &&
    !osdetail &&
    !storage &&
    !ram &&
    !camerafront &&
    !cameramain &&
    !batterycapacity &&
    !batterycharging &&
    !price
  ) {
    return {
      status: false,
      error: "Nothing To Update",
    };
  }

  mobile.name = name ? name : mobile.name;
  mobile.description = description ? description : mobile.description;
  mobile.brand = brand ? brand : mobile.brand;
  mobile.os.detail = osdetail ? osdetail : mobile.os.detail;
  mobile.memory.storage = storage ? storage : mobile.memory.storage;
  mobile.memory.ram = ram ? ram : mobile.memory.ram;
  mobile.camera.main = cameramain ? cameramain : mobile.camera.main;
  mobile.camera.selfie = camerafront ? camerafront : mobile.camera.selfie;
  mobile.battery.capacity = batterycapacity
    ? batterycapacity
    : mobile.battery.capacity;
  mobile.battery.charging = batterycharging
    ? batterycharging
    : mobile.battery.charging;

  if (["Android", "ios", "other"].includes(osname)) mobile.os.name = osname;

  const priceNum = Number(price);

  if (Number.isNaN(priceNum) || priceNum <= 0) mobile.price = priceNum;

  return {
    status: true,
  };
};

module.exports = {
  phoneInputExtract,
  uploader,
  uploadMultiple,
  updateMobile,
};

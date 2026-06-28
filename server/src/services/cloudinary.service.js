const cloudinary = require("../configs/cloudinary.config");

const uploadPromise = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      })
      .end(buffer);
  });
};

const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadPromise,
  deleteFile,
};

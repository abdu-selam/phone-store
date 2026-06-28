const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const mimetype = file.mimetype;

    if (
      [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp",
        "image/avif",
      ].includes(mimetype)
    ) {
      return cb(null, true);
    }

    cb(new Error("Invalid Image Format!"));
  },
});

module.exports = {
  upload,
};

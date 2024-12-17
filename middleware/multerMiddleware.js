const multer = require("multer");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const imageOriginalName = file.originalname.split(".")[0];
    const imageExtension = file.mimetype.split("/")[1];
    const fileName = `${
      file.fieldname
    }-${Date.now()}-${imageOriginalName}.${imageExtension}`;
    cb(null, fileName);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(
      appError.create(
        "Only image files are allowed!",
        400,
        httpStatusText.ERROR
      ),
      false
    );
  }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;

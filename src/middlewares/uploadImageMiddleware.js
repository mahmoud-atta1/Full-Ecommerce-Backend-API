const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMixOfImage = (arrayFields) => {
  return multerOptions().fields(arrayFields);
};

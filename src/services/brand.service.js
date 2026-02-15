const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Brand = require("../models/brand.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// @desc    Upload Brand image
// @route   POST /api/v1/brands
// @access  Private/Admin-Manager
exports.uploadBrandImage = uploadSingleImage("image");

// @desc    Resize and process Brand image
// @route   POST /api/v1/brands
// @access  Private/Admin-Manager
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private/Admin-Manager
exports.createBrand = factory.createOne(Brand);

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Private/Admin-Manager
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Admin-Manager
exports.deleteBrand = factory.deleteOne(Brand);
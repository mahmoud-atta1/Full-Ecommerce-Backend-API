const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/category.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// @desc    Upload category image
// @route   POST /api/v1/categories
// @access  Private/Admin-Manager
exports.uploadCategoryImage = uploadSingleImage("image");

// @desc    Resize and process category image
// @route   POST /api/v1/categories
// @access  Private/Admin-Manager
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;
  next();
});

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin-Manager
exports.createCategory = factory.createOne(Category);

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.deleteCategory = factory.deleteOne(Category);

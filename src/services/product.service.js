const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadMixOfImage } = require("../middlewares/uploadImageMiddleware");

const Product = require("../models/product.model");
const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");

// @desc    Upload product images (cover & gallery)
// @route   POST /api/v1/products
// @access  Private/Admin-Manager
exports.uploadProductImages = uploadMixOfImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// @desc    Resize product images
// @route   POST /api/v1/products
// @access  Private/Admin-Manager
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1330)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1330)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      }),
    );
  }
  next();
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin-Manager
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Check if category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(
      new ApiError(`No category for this id: ${req.body.category}`, 404),
    );
  }

  // Validate subcategories belong to category
  if (req.body.subcategories && req.body.subcategories.length > 0) {
    const subCategories = await SubCategory.find({
      _id: { $in: req.body.subcategories },
      category: req.body.category,
    });

    if (subCategories.length < req.body.subcategories.length) {
      return next(
        new ApiError(
          `One or more subcategories do not exist or do not belong to category ${req.body.category}`,
          400,
        ),
      );
    }
  }
  const product = await Product.create(req.body);

  res.status(201).json({
    data: product,
  });
});

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin-Manager
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin-Manager
exports.deleteProduct = factory.deleteOne(Product);

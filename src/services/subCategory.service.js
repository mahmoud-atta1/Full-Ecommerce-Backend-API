const SubCategory = require("../models/subCategory.model");
const factory = require("./handlersFactory");

// @desc    Set categoryId in request body for nested routes
// @route   POST /api/v1/categories/:categoryId/subcategories
// @access  Private/Admin-Manager
exports.setCategoryToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc    Create filter object for nested routes
// @route   GET /api/v1/categories/:categoryId/subcategories
// @access  Public
exports.createFliterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

// @desc    Create subcategory
// @route   POST /api/v1/subcategories
// @access  Private/Admin-Manager
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory, {
  path: "category",
  select: "name",
});

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Update subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private/Admin-Manager
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private/Admin-Manager
exports.deleteSubCategory = factory.deleteOne(SubCategory);

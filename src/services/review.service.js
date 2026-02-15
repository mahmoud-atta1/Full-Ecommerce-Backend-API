const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Review = require("../models/review.model");
const ApiError = require("../utils/apiError");

// @desc    Prevent duplicate reviews: Ensure a user reviews a product only once
// @route   Middleware
// @access  Private/User
exports.checkReviewDuplicate = asyncHandler(async (req, res, next) => {
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: req.body.product || req.params.productId,
  });

  if (existingReview) {
    return next(
      new ApiError("You have already created a review for this product", 400)
    );
  }
  next();
});

// @desc    Check review ownership: Only owner or admin/manager can modify
// @route   Middleware
// @access  Private
exports.checkReviewOwnership = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ApiError(`No review found with id ${req.params.id}`, 404));
  }

  // Authorization check: Only review owner (User role) or Admin/Manager
  if (
    req.user.role === "user" &&
    review.user._id.toString() !== req.user._id.toString()
  ) {
    return next(new ApiError("You are not allowed to perform this action", 403));
  }
  next();
});

// @desc    Nested Routes setup: Inject productId and userId into request body
// @route   Middleware (Pre-create)
// @access  Private/User
exports.setIdsToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  req.body.user = req.user._id.toString()
  next();
};

// @desc    Nested Filtering: Generate filter object for product reviews
// @route   Middleware (Pre-getAll)
// @access  Public
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};



// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private/User
exports.createReview = factory.createOne(Review);

// @desc    Get all reviews with dynamic filtering
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get a single review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    Update a review by ID
// @route   PUT /api/v1/reviews/:id
// @access  Private/User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete a review by ID
// @route   DELETE /api/v1/reviews/:id
// @access  Private/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);
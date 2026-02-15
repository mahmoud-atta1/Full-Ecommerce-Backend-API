const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../validators/review.validator");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setIdsToBody,
  checkReviewDuplicate,
  checkReviewOwnership,
} = require("../services/review.service");

const auth = require("../services/auth.service");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    auth.protect,
    auth.allowedTo("user"),
    setIdsToBody,
    createReviewValidator,
    checkReviewDuplicate,
    createReview,
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    auth.protect,
    auth.allowedTo("user"),
    updateReviewValidator,
    checkReviewOwnership,
    updateReview,
  )
  .delete(
    auth.protect,
    auth.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    checkReviewOwnership,
    deleteReview,
  );

module.exports = router;

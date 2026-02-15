const express = require("express");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/product.validator");

const {
  uploadProductImages,
  resizeProductImages,
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../services/product.service");

const auth = require("../services/auth.service");
const reviewsRoute = require("./review.routes");

const router = express.Router();

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;

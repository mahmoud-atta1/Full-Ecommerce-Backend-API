const express = require("express");

const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validators/brand.validator");

const {
  uploadBrandImage,
  resizeImage,
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brand.service");

const auth = require("../services/auth.service");

const router = express.Router();

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;

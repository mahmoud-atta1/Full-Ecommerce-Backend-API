const express = require("express");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../validators/category.validator");

const {
  uploadCategoryImage,
  resizeImage,
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/category.service");

const auth = require("../services/auth.service");
const subCategoriesRoute = require("./subCategory.routes");

const router = express.Router();

//@desc Nested route for subcategories
//@route /api/v1/categories/:categoryId/subcategories
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  )
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory,
  );

module.exports = router;

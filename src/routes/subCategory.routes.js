const express = require("express");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../validators/subCategory.validator");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryToBody,
  createFliterObject,
} = require("../services/subCategory.service");

const auth = require("../services/auth.service");

//@desc   SubCategory routes
//@note   mergeParams allows access to categoryId from parent router
const router = express.Router({ mergeParams: true });

//@desc   Create subcategory | Get subcategories (nested supported)
router
  .route("/")
  .post(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    setCategoryToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFliterObject, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    auth.protect,
    auth.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;

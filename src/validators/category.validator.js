const joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const idParamSchema = joi.object({
  id: joi.string().hex().length(24).required().messages({
    "string.length": "Invalid ID format",
    "string.hex": "Invalid ID format",
    "any.required": "ID is required",
  }),
});

const createCategorySchema = joi.object({
  name: joi.string().min(3).max(32).required().messages({
    "string.min": "Too short category name",
    "string.max": "Too long category name",
    "any.required": "Category name is required",
  }),
  image: joi.string().optional(),
});

const updateCategorySchema = joi.object({
  name: joi.string().min(3).max(32).messages({
    "string.min": "Too short category name",
    "string.max": "Too long category name",
  }),
  image: joi.string().optional(),
});

exports.getCategoryValidator = validatorMiddleware({
  params: idParamSchema,
});

exports.createCategoryValidator = validatorMiddleware({
  body: createCategorySchema,
});

exports.updateCategoryValidator = validatorMiddleware({
  params: idParamSchema,
  body: updateCategorySchema,
});

exports.deleteCategoryValidator = validatorMiddleware({
  params: idParamSchema,
});

const joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const idParamSchema = joi.object({
  id: joi.string().hex().length(24).required().messages({
    "string.length": "Invalid ID format",
    "string.hex": "Invalid ID format",
  }),
});

const createSubCategorySchema = joi.object({
  name: joi.string().min(2).max(32).required(),
  category: joi.string().hex().length(24).required(),
});

const updateSubCategorySchema = joi.object({
  name: joi.string().min(2).max(32),
  category: joi.string().hex().length(24),
});

exports.createSubCategoryValidator = validatorMiddleware({
  body: createSubCategorySchema,
});

exports.getSubCategoryValidator = validatorMiddleware({
  params: idParamSchema,
});

exports.updateSubCategoryValidator = validatorMiddleware({
  params: idParamSchema,
  body: updateSubCategorySchema,
});

exports.deleteSubCategoryValidator = validatorMiddleware({
  params: idParamSchema,
});

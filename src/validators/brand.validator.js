const joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const idParamSchema = joi.object({
  id: joi.string().hex().length(24).required().messages({
    "string.length": "Invalid ID format",
    "string.hex": "Invalid ID format",
    "any.required": "ID is required",
  }),
});

const createBrandSchema = joi.object({
  name: joi.string().min(3).max(32).required().messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 32 characters",
    "any.required": "Name is required",
  }),
  image: joi.string().optional(),
});

const updateBrandSchema = joi.object({
  name: joi.string().min(3).max(32).messages({
    "string.min": "Brand name must be at least 3 characters",
    "string.max": "Brand name must be less than 32 characters",
  }),
  image: joi.string().optional(),
});

exports.getBrandValidator = validatorMiddleware({
  params: idParamSchema,
});

exports.createBrandValidator = validatorMiddleware({
  body: createBrandSchema,
});

exports.updateBrandValidator = validatorMiddleware({
  params: idParamSchema,
  body: updateBrandSchema,
});

exports.deleteBrandValidator = validatorMiddleware({
  params: idParamSchema,
});

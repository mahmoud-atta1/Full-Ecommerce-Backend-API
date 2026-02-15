const joi = require("joi");
const Product = require("../models/product.model");
const Review = require("../models/review.model");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const idParamSchema = joi.object({
  id: joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid ID format",
    "string.length": "Invalid ID length",
    "any.required": "ID is required",
  }),
});

const createReviewSchema = joi.object({
  title: joi.string().optional(),

  ratings: joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1.0",
    "number.max": "Rating must be at most 5.0",
    "any.required": "Ratings value is required",
  }),
  product: joi
    .string()
    .hex()
    .length(24)
    .required()
    .external(async (val) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error(`No product found with id: ${val}`);
      }
    })
    .messages({
      "any.required": "Product ID is required",
    }),

  user: joi.string().hex().length(24).required().messages({
    "any.required": "User ID is required",
  }),
});

const updateReviewSchema = joi.object({
  title: joi.string().optional(),
  ratings: joi.number().min(1).max(5).optional().messages({
    "number.min": "Rating must be at least 1.0",
    "number.max": "Rating must be at most 5.0",
  }),
  product: joi.forbidden(),
  user: joi.forbidden(),
});

exports.createReviewValidator = validatorMiddleware({
  body: createReviewSchema,
});

exports.getReviewValidator = validatorMiddleware({ params: idParamSchema });

exports.updateReviewValidator = validatorMiddleware({
  params: idParamSchema,
  body: updateReviewSchema,
});

exports.deleteReviewValidator = validatorMiddleware({ params: idParamSchema });

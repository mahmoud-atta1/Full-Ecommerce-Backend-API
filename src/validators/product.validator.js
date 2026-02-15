const joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const createProductSchema = joi.object({
  title: joi.string().min(3).max(100).required(),
  description: joi.string().required().min(20),
  quantity: joi.number().required().min(0),
  sold: joi.number().default(0),
  price: joi.number().required().min(0),
  priceAfterDiscount: joi.number().min(0).less(joi.ref("price")).messages({
    "number.less": "Price after discount must be lower than price",
  }),

  colors: joi.array().items(joi.string()),
  imageCover: joi.string().required(),
  images: joi.array().items(joi.string()),

  category: joi.string().hex().length(24).required(),
  subcategories: joi.array().items(joi.string().hex().length(24)),
  brand: joi.string().hex().length(24).optional(),
  ratingsAverage: joi.number().min(1).max(5),
  ratingsQuantity: joi.number().min(0),
});

const updateProductSchema = joi.object({
  title: joi.string().min(3).max(100),
  description: joi.string().min(20),
  quantity: joi.number().min(0),
  sold: joi.number(),
  price: joi.number().min(0),
  priceAfterDiscount: joi.number().min(0).less(joi.ref("price")),
  colors: joi.array().items(joi.string()),
  imageCover: joi.string(),
  images: joi.array().items(joi.string()),
  category: joi.string().hex().length(24),
  subcategories: joi.array().items(joi.string().hex().length(24)),
  brand: joi.string().hex().length(24),
  ratingsAverage: joi.number().min(1).max(5),
  ratingsQuantity: joi.number().min(0),
});

const idParamSchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

exports.createProductValidator = validatorMiddleware({
  body: createProductSchema,
});

exports.updateProductValidator = validatorMiddleware({
  params: idParamSchema,
  body: updateProductSchema,
});

exports.getProductValidator = validatorMiddleware({
  params: idParamSchema,
});

exports.deleteProductValidator = validatorMiddleware({
  params: idParamSchema,
});

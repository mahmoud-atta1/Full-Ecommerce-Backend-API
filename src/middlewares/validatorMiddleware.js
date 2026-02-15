const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc    Validate request using Joi schema
const validatorMiddleware = (schema) =>
  asyncHandler(async (req, res, next) => {
    const validationOptions = { abortEarly: false };

    try {
      if (schema.body) {
        await schema.body.validateAsync(req.body, validationOptions);
      }
      if (schema.params) {
        await schema.params.validateAsync(req.params, validationOptions);
      }
      if (schema.query) {
        await schema.query.validateAsync(req.query, validationOptions);
      }

      next();
    }catch (err) {
      const errors = err.details
        ? err.details.map((val) => val.message).join(", ")
        : err.message; 
      next(new ApiError(errors, 400));
    }
  });

module.exports = validatorMiddleware;

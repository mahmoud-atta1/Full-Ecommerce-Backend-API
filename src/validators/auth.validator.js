const joi = require("joi");
const User = require("../models/user.model");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const signupSchema = joi.object({
  name: joi.string().min(3).max(32).required().messages({
    "string.min": "Name must be at least 3 characters",
    "any.required": "Name is required",
  }),

  email: joi
    .string()
    .email()
    .required()
    .external(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use");
      }
    })
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  password: joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  passwordConfirm: joi.valid(joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match",
    "any.required": "Password confirmation is required",
  }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),

  password: joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const resetPasswordSchema = joi.object({
  password: joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  passwordConfirm: joi.valid(joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match",
  }),
});

exports.signupValidator = validatorMiddleware({ body: signupSchema });

exports.loginValidator = validatorMiddleware({ body: loginSchema });

exports.resetPasswordValidator = validatorMiddleware({
  body: resetPasswordSchema,
});

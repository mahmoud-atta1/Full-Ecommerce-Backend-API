const joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User = require("../models/user.model");

const idParamSchema = joi.object({
  id: joi.string().hex().length(24).required().messages({
    "string.length": "Invalid ID format",
    "string.hex": "Invalid ID format",
    "any.required": "ID is required",
  }),
});

const passwordSchema = joi.string().min(6).required().messages({
  "string.min": "Password must be at least 6 characters",
  "any.required": "Password is required",
});

const createUserSchema = joi.object({
  name: joi.string().min(3).max(32).required().messages({
    "string.min": "Name must be at least 3 characters",
    "any.required": "Name is required",
  }),

  email: joi
    .string()
    .email()
    .required()
    .external(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error("Email already exists");
    })
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  phone: joi
    .string()
    .pattern(/^(010|011|012|015)[0-9]{8}$/)
    .messages({
      "string.pattern.base": "Invalid Egyptian phone number",
    })
    .optional(),

  profileImg: joi.string().optional(),
  password: passwordSchema,

  passwordConfirm: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match password",
    "any.required": "Password confirmation is required",
  }),

  role: joi.string().valid("user", "admin", "manager").optional(),
  active: joi.boolean().optional(),
});

const updateUserSchema = joi.object({
  name: joi.string().min(3).max(32).optional(),

  email: joi
    .string()
    .email()
    .external(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error("Email already exists");
    })
    .optional(),

  phone: joi
    .string()
    .pattern(/^(010|011|012|015)[0-9]{8}$/)
    .optional(),

  profileImg: joi.string().optional(),
  active: joi.boolean().optional(),
  role: joi.string().valid("user", "admin", "manager").optional(),
});

const changeUserPasswordSchema = joi.object({
  currentPassword: joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  password: passwordSchema,
  passwordConfirm: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match password",
  }),
});

exports.getUserValidator = validatorMiddleware({ params: idParamSchema });

exports.createUserValidator = validatorMiddleware({ body: createUserSchema });

exports.updateUserValidator = validatorMiddleware({
  params: idParamSchema,
  body: updateUserSchema,
});

exports.updateLoggedUserValidator = validatorMiddleware({
  body: updateUserSchema,
});

exports.deleteUserValidator = validatorMiddleware({ params: idParamSchema });

exports.changePasswordValidator = validatorMiddleware({
  body: changeUserPasswordSchema,
});

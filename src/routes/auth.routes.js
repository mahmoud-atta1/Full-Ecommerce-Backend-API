const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logout,
  protect,
} = require("../services/auth.service");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "fail",
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    status: "fail",
    message: "Too many password reset requests, please try again after an hour",
  },
});

router.post("/signup", signupValidator, signup);
router.post("/login", loginLimiter, loginValidator, login);
router.post("/forgotpassword", emailLimiter, forgotPassword);
router.post("/resetpassword/:token", resetPasswordValidator, resetPassword);
router.post("/refreshtoken", refreshAccessToken);
router.post("/logout", protect, logout);

module.exports = router;

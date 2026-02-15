const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email, // check email is exsit in validator
    password: req.body.password,
  });

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Hash refresh token and save to DB
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  user.password = undefined;
  res.status(201).json({
    status: "success",
    accessToken,
    refreshToken,
    data: user,
  });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Incorrect Email or Password", 401));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Update refresh token in DB
  await User.findByIdAndUpdate(user._id, {
    refreshToken: hashToken(refreshToken),
  });

  user.password = undefined;
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
    data: user,
  });
});

// @desc    Make sure the user is logged in
// @route   [Middleware]
// @access  Private
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in! Please login to get access.", 401),
    );
  }

  // Verify token (no change happens, expired token)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired token", 401));
  }

  // Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );
  }

  // Check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (decoded.iat < changedTimestamp) {
      return next(
        new ApiError(
          "User recently changed password! Please login again.",
          401,
        ),
      );
    }
  }

  // 5. Check if user is active/logged out (Refresh token check)
  if (!currentUser.refreshToken) {
    return next(
      new ApiError("User recently logged out! Please login again.", 401),
    );
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// @route   [Middleware]
// @access  Private/Admin-Manager
exports.allowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  };

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with that email address", 404));
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token and set to fields in DB
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  //  Send email
  // URL pointing to Frontend
  const resetUrl = `${process.env.APP_FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a request with your new password to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Your password reset token (valid for 10 min)",
      text: message,
    });

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email!" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  }
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = hashToken(req.params.token);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  user.refreshToken = hashToken(refreshToken);

  await user.save();

  user.password = undefined;
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
  });
});

// @desc    Refresh Access Token
// @route   POST /api/v1/auth/refreshtoken
// @access  Public (Protected by Refresh Token)
exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ApiError("Refresh token is required", 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired refresh token", 401));
  }

  // Check if token matches DB
  const hashedRefreshToken = hashToken(refreshToken);
  const user = await User.findOne({
    _id: decoded.userId,
    refreshToken: hashedRefreshToken,
  });

  if (!user) {
    return next(new ApiError("Invalid refresh token", 401));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  res.status(200).json({ status: "success", accessToken });
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

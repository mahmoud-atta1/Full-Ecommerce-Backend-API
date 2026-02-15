const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @desc    Upload user profile image
// @route   POST /api/v1/users
// @access  Private (Admin/User)
exports.uploadUserImage = uploadSingleImage("profileImg");

// @desc    Resize user profile image middleware
// @access  Private
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);

  req.body.profileImg = filename;
  next();
});

// @desc    Create new user
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Get list of all users
// @access  Private/Admin-Manager
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by ID
// @access  Private/Admin-Manager
exports.getUser = factory.getOne(User);

// @desc    Update user details by ID
// @access  Private/Admin
exports.updateUser = factory.updateOne(User);

// @desc    Remove user account by ID
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc    Retrieve personal account data
// @access  Private/User
exports.getloggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update personal profile information
// @access  Private/User
exports.updateMe = asyncHandler(async (req, res, next) => {
  if (req.body.password) {
    return next(new ApiError("Use changeMyPassword route", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    { new: true },
  );

  res.status(200).json({ data: user });
});

// @desc    Change personal password with token rotation
// @access  Private/User
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return next(new ApiError("User not found", 404));

  // Validate current password
  const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!isMatch) return next(new ApiError("Current password is incorrect", 400));

  // Update password and refresh token for session security
  user.password = req.body.password;
  user.passwordChangedAt = Date.now();

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
    accessToken,
    refreshToken,
  });
});

// @desc    Deactivate personal account (Soft Delete)
// @access  Private/User
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).send();
});

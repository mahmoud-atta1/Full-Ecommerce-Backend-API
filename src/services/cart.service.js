const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // If no cart exists, create new one
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // If cart exists, check if product and color is already there
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );

    if (productIndex > -1) {
      // Product exists -> Update quantity
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // Product doesn't exist -> Push to array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404),
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item._id.toString() !== req.params.itemId,
  );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId,
  );

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
  } else {
    return next(
      new ApiError(`There is no item for this id : ${req.params.itemId}`, 404),
    );
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon.toUpperCase(),
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`, 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
  }

  const totalPrice = cart.totalCartPrice;
  const discountAmount = (totalPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = (totalPrice - discountAmount).toFixed(2);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

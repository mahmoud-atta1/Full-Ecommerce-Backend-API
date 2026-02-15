const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cart.service");

const auth = require("../services/auth.service");

const router = express.Router();
router.use(auth.protect, auth.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;

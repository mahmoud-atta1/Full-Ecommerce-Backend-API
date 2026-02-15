const express = require("express");

const auth = require("../services/auth.service");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlist.service");

const router = express.Router();
router.use(auth.protect, auth.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);
router.delete("/:productId", removeProductFromWishlist);

module.exports = router;

const express = require("express");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/address.service");

const auth = require("../services/auth.service");

const router = express.Router();

router.use(auth.protect, auth.allowedTo("user"));
router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.delete("/:addressId", removeAddress);

module.exports = router;

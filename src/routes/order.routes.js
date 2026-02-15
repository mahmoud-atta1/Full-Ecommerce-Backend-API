const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/order.service");

const authService = require("../services/auth.service");

const router = express.Router();
router.use(authService.protect);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession,
);

router.post("/:cartId", authService.allowedTo("user"), createCashOrder);

router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders,
);

router.get("/:id", getSpecificOrder);

router.use(authService.allowedTo("admin", "manager"));

router.put("/:id/pay", updateOrderToPaid);

router.put("/:id/deliver", updateOrderToDelivered);

module.exports = router;

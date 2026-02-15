const categoryRoute = require("./category.routes");
const subCategoryRoute = require("./subCategory.routes");
const brandRoute = require("./brand.routes");
const productRoute = require("./product.routes");
const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const reviewRoute = require("./review.routes");
const wishlistRoute = require("./wishlist.routes");
const addressRoute = require("./address.routes");
const couponRoute = require("./coupon.routes");
const cartRoute = require("./cart.routes");
const orderRoute = require("./order.routes");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/addresses", addressRoute);

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/cart", cartRoute);
};

module.exports = mountRoutes;

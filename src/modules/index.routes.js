const errorMw = require("../../middlewares/error-mw");
const AppError = require("../utils/AppError");
const addressRouter = require("./address/address.router");
const authRouter = require("./auth/auth.router");
const brandRouter = require("./brand/brand.router");
const cartRouter = require("./cart/cart.router");
const categoryRouter = require("./category/category.router");
const couponRouter = require("./coupon/coupon.router");
const orderRouter = require("./order/order.router");
const productRouter = require("./product/product.router");
const ReviewRouter = require("./review/review.router");
const subCategoryRouter = require("./subcategory/subcategory.router");
const userRouter = require("./user/user.router");
const wishlistRouter = require("./wishlist/wishlist.router");

module.exports.init = (app) => {
  app.use("/category", categoryRouter);
  app.use("/subcategory", subCategoryRouter);
  app.use("/brands", brandRouter);
  app.use("/products", productRouter);
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/reviews", ReviewRouter);
  app.use("/wishlist", wishlistRouter);
  app.use("/addresses", addressRouter);
  app.use("/coupons", couponRouter);
  app.use("/carts", cartRouter);
  app.use("/orders", orderRouter);

  app.all("*", (req, res, next) =>
    next(new AppError(`cant find this route ${req.originalUrl}`, 404))
  );
  app.use(errorMw);
};

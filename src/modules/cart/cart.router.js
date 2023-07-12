const express = require("express");
const {
  addProductToCart,
  removeProductFromCart,
  updateQuantity,
  applyCoupon,
  getUserCart,
} = require("./cart.controller");

const { protectedRoutes, allowedTo } = require("../auth/auth.controller");

const cartRouter = express.Router();

cartRouter
  .route("")
  .post(protectedRoutes, allowedTo("user", "admin"), addProductToCart)
  .get(protectedRoutes, allowedTo("user", "admin"), getUserCart);

cartRouter
  .route("/applyCoupon")
  .post(protectedRoutes, allowedTo("user", "admin"), applyCoupon);

cartRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user", "admin"), removeProductFromCart)
  .put(protectedRoutes, allowedTo("user"), updateQuantity);

module.exports = cartRouter;

const express = require("express");

const { protectedRoutes, allowedTo } = require("../auth/auth.controller");
const {
  addToWishList,
  removeFromWishlist,
  getAllUserWishlist,
} = require("./wishlist.controller");

const wishlistRouter = express.Router();

wishlistRouter
  .route("")
  .patch(protectedRoutes, allowedTo("user"), addToWishList)
  .delete(protectedRoutes, allowedTo("user"), removeFromWishlist)
  .get(protectedRoutes, allowedTo("user"), getAllUserWishlist);

module.exports = wishlistRouter;

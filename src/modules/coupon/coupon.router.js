const express = require("express");
const {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} = require("./coupon.controller");

const { protectedRoutes, allowedTo } = require("../auth/auth.controller");

const couponRouter = express.Router();

couponRouter
  .route("")
  .post(protectedRoutes, allowedTo("user", "admin"), createCoupon)
  .get(getAllCoupons);
couponRouter
  .route("/:id")
  .get(getCoupon)
  .delete(protectedRoutes, allowedTo("user", "admin"), deleteCoupon)
  .put(protectedRoutes, allowedTo("user", "admin"), updateCoupon);

module.exports = couponRouter;

const express = require("express");
const {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} = require("./review.controller");
// const validator = require("./review.validate");
// const validationError = require("../../../middlewares/validation");
const { protectedRoutes, allowedTo } = require("../auth/auth.controller");

const ReviewRouter = express.Router();

ReviewRouter.route("")
  .post(protectedRoutes, allowedTo("user"), createReview)
  .get(getAllReviews);
ReviewRouter.route("/:id")
  .get(getReview)
  .delete(protectedRoutes, allowedTo("user"), deleteReview)
  .put(protectedRoutes, allowedTo("admin", "user"), updateReview);

module.exports = ReviewRouter;

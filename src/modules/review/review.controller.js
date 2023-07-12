const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const ApiFeatures = require("../../utils/ApiFeatures");
const Review = mongoose.model("Review");

module.exports.createReview = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isReview = await Review.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReview) return next(new AppError("you reviewed it before", 409));
  let result = new Review(req.body);
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Review.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  let result = await apiFeatures.mongooseQuery; //.populate("user", "name");
  res.json({ message: "success", page: apiFeatures.page, result });
});

exports.getReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await Review.findById(id);
  !result && next(new AppError("Review not found", 404));
  result && res.json({ message: "success", result });
});

module.exports.updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  // let isReview = await Review.findById(id);
  let result = await Review.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  !result &&
    next(
      new AppError("Review not found or you are not authorized to update", 404)
    );
  result && res.json({ message: "success", result });
});

exports.deleteReview = deleteOne(Review);

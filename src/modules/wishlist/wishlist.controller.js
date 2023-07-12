const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const User = mongoose.model("User");

module.exports.addToWishList = catchAsyncError(async (req, res, next) => {
  const { product } = req.body;
  let result = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: product } },
    {
      new: true,
    }
  );

  !result && next(new AppError("User not found ", 404));
  result && res.json({ message: "success", result: result.wishlist });
});
module.exports.removeFromWishlist = catchAsyncError(async (req, res, next) => {
  const { product } = req.body;
  let result = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: product } },
    {
      new: true,
    }
  );

  !result && next(new AppError("User not found ", 404));
  result && res.json({ message: "success", result: result.wishlist });
});
module.exports.getAllUserWishlist = catchAsyncError(async (req, res, next) => {
  let result = await User.findOne({ _id: req.user._id }).populate("wishlist");

  !result && next(new AppError("User not found ", 404));
  result && res.json({ message: "success", result: result.wishlist });
});

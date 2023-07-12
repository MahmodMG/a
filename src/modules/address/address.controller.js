const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const User = mongoose.model("User");

module.exports.addAddress = catchAsyncError(async (req, res, next) => {
  let result = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );

  !result && next(new AppError("User not found ", 404));
  result && res.json({ message: "success", result: result.addresses });
});
module.exports.removeAddress = catchAsyncError(async (req, res, next) => {
  let result = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.body.address } } },
    {
      new: true,
    }
  );

  !result && next(new AppError("User not found ", 404));
  result && res.json({ message: "success", result: result.addresses });
});
module.exports.getAllUserAddress = catchAsyncError(async (req, res, next) => {
  let result = await User.findOne({ _id: req.user._id });

  !result && next(new AppError("User not found ", 404));
  result && res.json({ message: "success", result: result.addresses });
});

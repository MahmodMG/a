const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const ApiFeatures = require("../../utils/ApiFeatures");
const User = mongoose.model("User");

module.exports.createUser = catchAsyncError(async (req, res, next) => {
  // let user = await User.findOne({ email: req.body.email });
  // if (user) {
  //   return next(new AppError("account already exist", 409));
  // }
  let result = new User(req.body);
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

exports.getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await User.findById(id);
  !result && next(new AppError("User not found", 404));
  result && res.json({ message: "success", result });
});

module.exports.updateUser = catchAsyncError(async (req, res, next) => {
  let result = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  !result && next(new AppError("User not found", 404));
  result && res.json({ message: "success", result });
});

exports.deleteUser = deleteOne(User);

module.exports.changeUserPassword = catchAsyncError(async (req, res, next) => {
  req.body.passwordChangeAt = Date.now();
  let result = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  !result && next(new AppError("User not found", 404));
  result && res.json({ message: "success", result });
});

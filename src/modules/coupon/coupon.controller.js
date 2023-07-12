const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const ApiFeatures = require("../../utils/ApiFeatures");
const Coupon = mongoose.model("Coupon");
const QRCode = require("qrcode");

module.exports.createCoupon = catchAsyncError(async (req, res, next) => {
  let result = new Coupon(req.body);
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllCoupons = catchAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Coupon.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

exports.getCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await Coupon.findById(id);
  let url = await QRCode.toDataURL(result.code);

  !result && next(new AppError("Coupon not found", 404));
  result && res.json({ message: "success", result, url });
});

module.exports.updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

  !result && next(new AppError("Coupon not found", 404));
  result && res.json({ message: "success", result });
});

exports.deleteCoupon = deleteOne(Coupon);

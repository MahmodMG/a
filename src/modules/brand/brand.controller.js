const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const ApiFeatures = require("../../utils/ApiFeatures");
const Brand = mongoose.model("Brand");

module.exports.createBrand = catchAsyncError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  let result = new Brand(req.body);
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllBrands = catchAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

exports.getBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await Brand.findById(id);
  !result && next(new AppError("Brand not found", 404));
  result && res.json({ message: "success", result });
});

module.exports.updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  let result = await Brand.findByIdAndUpdate(id, req.body, { new: true });

  !result && next(new AppError("Brand not found", 404));
  result && res.json({ message: "success", result });
});

exports.deleteBrand = deleteOne(Brand);

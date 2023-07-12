const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const ApiFeatures = require("../../utils/ApiFeatures");
const Category = mongoose.model("Category");

module.exports.createCategory = catchAsyncError(async (req, res, next) => {
  // await Category.insertMany({ name });
  // await Category.create({ name });
  // Category.create(req.body)
  //   .then((Category) => {
  //     res.status(201).json(Category);
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  let result = new Category(req.body);
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllCategories = catchAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

exports.getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await Category.findById(id);
  !result && next(new AppError("category not found", 404));
  result && res.json({ message: "success", result });

  // if (!result) {
  //   return next(new AppError("category not found", 404));
  // }
  // res.json({ message: "success", result });
});

module.exports.updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  let result = await Category.findByIdAndUpdate(id, req.body, { new: true });

  !result && next(new AppError("category not found", 404));
  result && res.json({ message: "success", result });
});

exports.deleteCategory = deleteOne(Category);

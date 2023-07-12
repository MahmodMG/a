const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const SubCategory = mongoose.model("SubCategory");

module.exports.createSubCategory = catchAsyncError(async (req, res, next) => {
  const { name, category } = req.body;
  let result = new SubCategory({ name, category, slug: slugify(name) });
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllSubCategories = catchAsyncError(async (req, res, next) => {
  console.log(req.params);
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }

  let result = await SubCategory.find(filter);
  res.json({ message: "success", result });
});

exports.getSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await SubCategory.findById(id);
  !result && next(new AppError("Subcategory not found", 404));
  result && res.json({ message: "success", result });
});

module.exports.updateSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  let result = await SubCategory.findByIdAndUpdate(
    id,
    {
      name,
      category,
      slug: slugify(name),
    },
    { new: true }
  );

  !result && next(new AppError("Subcategory not found", 404));
  result && res.json({ message: "success", result });
});

exports.deleteSubCategory = deleteOne(SubCategory);

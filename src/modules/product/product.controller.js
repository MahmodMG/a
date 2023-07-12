const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const deleteOne = require("../handlers/factor.handler");
const ApiFeatures = require("../../utils/ApiFeatures");
const Product = mongoose.model("Product");
//we use skip() limit() for pagination
module.exports.createProduct = catchAsyncError(async (req, res, next) => {
  // adding slug property to body
  req.body.slug = slugify(req.body.title);

  // console.log(req.files);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((obj) => obj.filename);
  let result = new Product(req.body);
  await result.save();
  res.json({ message: "success", result });
});

module.exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  // // 1 pagination ===========
  // let page = req.query.page * 1 || 1;
  // if (req.query.page <= 0) page = 1;
  // let skip = (page - 1) * 5;

  // // 2 filter =================
  // let filterobj = { ...req.query }; // copy obj
  // let excludedQuery = ["page", "sort", "fields", "keyword"];
  // excludedQuery.forEach((q) => {
  //   delete filterobj[q];
  // });
  // // console.log(filterobj);
  // filterobj = JSON.stringify(filterobj);
  // filterobj = filterobj.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  // filterobj = JSON.parse(filterobj);
  // console.log(filterobj);

  // // 3 sort =================
  // if (req.query.sort) {
  //   let sortedBy = req.query.sort.split(",").join(" ");
  //   console.log(sortedBy);
  //   mongooseQuery.sort(sortedBy);
  // }

  // // 4 search ===============
  // // $regex , $options: "i" to search with upper and lower case
  // if (req.query.keyword) {
  //   mongooseQuery.find({
  //     $or: [
  //       { title: { $regex: req.query.keyword, $options: "i" } },
  //       { description: { $regex: req.query.keyword, $options: "i" } },
  //     ],
  //   });
  // }

  // // 5  select fields=============
  // if (req.query.fields) {
  //   let fields = req.query.fields.split(",").join(" ");
  //   console.log(fields);
  //   mongooseQuery.select(fields);
  // }

  let apiFeatures = new ApiFeatures(
    Product.find().populate("category"),
    req.query
  )
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  //excute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

exports.getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await Product.findById(id);
  !result && next(new AppError("Product not found", 404));
  result && res.json({ message: "success", result });
});

module.exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);

  let result = await Product.findByIdAndUpdate(id, req.body, { new: true });

  !result && next(new AppError("Product not found", 404));
  result && res.json({ message: "success", result });
});

exports.deleteProduct = deleteOne(Product);

// module.exports.deleteAllProducts = catchAsyncError(async (req, res, next) => {
//   let result = await Product.deleteMany();
//   !result && next(new AppError("Product not found", 404));
//   result && res.json({ message: "success", result });
// });

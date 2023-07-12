const catchAsyncError = require("../../../middlewares/catchAsyncError");
const AppError = require("../../utils/AppError");

const deleteOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let result = await model.findByIdAndDelete(id);

    !result && next(new AppError("document not found", 404));
    result && res.json({ message: "success", result });
  });
};
module.exports = deleteOne;

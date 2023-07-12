const express = require("express");
const {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
} = require("./subcategory.controller");

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter.route("").post(createSubCategory).get(getAllSubCategories);
subCategoryRouter
  .route("/:id")
  .get(getSubCategory)
  .delete(deleteSubCategory)
  .put(updateSubCategory);

module.exports = subCategoryRouter;

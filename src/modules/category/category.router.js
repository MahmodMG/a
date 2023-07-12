const express = require("express");
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} = require("./category.controller");
require("../../../databases/models/subcategory.model");
const subCategoryRouter = require("../subcategory/subcategory.router");
const validator = require("./category.validate");
const validationError = require("../../../middlewares/validation");
const { uploadSingleFile } = require("../../../middlewares/fileUpload");

const categoryRouter = express.Router();

///////////////

categoryRouter.use("/:categoryId/subcategory", subCategoryRouter);

categoryRouter
  .route("")
  .post(
    uploadSingleFile("image", "category"),
    // validator.addCategory,
    // validationError,
    createCategory
  )
  .get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(validator.getSingleCategory, validationError, getCategory)
  .delete(validator.deleteCategory, validationError, deleteCategory)
  .put(
    uploadSingleFile("image", "category"),
    validator.editCategory,
    validationError,
    updateCategory
  );

module.exports = categoryRouter;

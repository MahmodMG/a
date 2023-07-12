const express = require("express");
const {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} = require("./brand.controller");
const validator = require("./brand.validate");
const validationError = require("../../../middlewares/validation");
const { uploadSingleFile } = require("../../../middlewares/fileUpload");
const { protectedRoutes, allowedTo } = require("../auth/auth.controller");
// require("../../../databases/models/brand.model");
// const brandRouter = require("../brand/brand.router");

const brandRouter = express.Router();

// brandRouter.use("/:BrandId/subBrand", subBrandRouter);
brandRouter
  .route("")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("logo", "brand"),
    validator.addBrand,
    validationError,
    createBrand
  )
  .get(getAllBrands);
brandRouter
  .route("/:id")
  .get(validator.getSingleBrand, validationError, getBrand)
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validator.deleteBrand,
    validationError,
    deleteBrand
  )
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("logo", "brand"),
    validator.editBrand,
    validationError,
    updateBrand
  );

module.exports = brandRouter;

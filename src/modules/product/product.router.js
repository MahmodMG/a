const express = require("express");
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteAllProducts,
} = require("./product.controller");
const { uploadMixOfFiles } = require("../../../middlewares/fileUpload");
const { protectedRoutes, allowedTo } = require("../auth/auth.controller");

require("../../../databases/models/product.model");

const productRouter = express.Router();

let fieldsArr = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
];
// productRouter.route("/delete").delete(deleteAllProducts);
productRouter
  .route("")
  .post(
    protectedRoutes,
    allowedTo("admin", "user"),
    uploadMixOfFiles(fieldsArr, "product"),
    createProduct
  )
  .get(getAllProducts);
productRouter
  .route("/:id")
  .get(getProduct)
  .delete(protectedRoutes, allowedTo("admin", "user"), deleteProduct)
  .put(protectedRoutes, allowedTo("admin"), updateProduct);

module.exports = productRouter;

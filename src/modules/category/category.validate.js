const { param, body, query } = require("express-validator");

module.exports.getSingleCategory = param("id")
  .isMongoId()
  .withMessage("id must be  ObjectId");

module.exports.addCategory = [
  body("name").isString().withMessage("must be string"),
];

module.exports.editCategory = [
  param("id").isMongoId().withMessage("id must be mongo ObjectId"),
  body("name").isString().withMessage("must be string"),
];

module.exports.deleteCategory = param("id")
  .isMongoId()
  .withMessage("id must be mongo ObjectId");

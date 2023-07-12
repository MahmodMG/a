const express = require("express");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  changeUserPassword,
} = require("./user.controller");
const validator = require("./user.validate.js");
const validationError = require("../../../middlewares/validation");

const userRouter = express.Router();

userRouter.route("").post(createUser).get(getAllUsers);
userRouter.route("/:id").get(getUser).delete(deleteUser).put(updateUser);
userRouter.patch("/changeUserPassword/:id", changeUserPassword);
module.exports = userRouter;

const express = require("express");

const { protectedRoutes, allowedTo } = require("../auth/auth.controller");
const {
  addAddress,
  removeAddress,
  getAllUserAddress,
} = require("./address.controller");

const addressRouter = express.Router();

addressRouter
  .route("")
  .patch(protectedRoutes, allowedTo("user"), addAddress)
  .delete(protectedRoutes, allowedTo("user"), removeAddress)
  .get(protectedRoutes, allowedTo("user"), getAllUserAddress);

module.exports = addressRouter;

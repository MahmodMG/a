const express = require("express");
const {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckOutSession,
} = require("./order.controller");

const { protectedRoutes, allowedTo } = require("../auth/auth.controller");

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), getSpecificOrder);

orderRouter.get("/all", protectedRoutes, allowedTo("user"), getAllOrders);

orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), createCashOrder);

orderRouter.post(
  "/checkOut/:id",
  protectedRoutes,
  allowedTo("user"),
  createCheckOutSession
);

module.exports = orderRouter;

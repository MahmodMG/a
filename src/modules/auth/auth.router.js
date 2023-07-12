const express = require("express");
const { signIn, signup } = require("./auth.controller");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
module.exports = authRouter;

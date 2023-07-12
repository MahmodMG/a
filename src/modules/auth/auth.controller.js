const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");
const catchAsyncError = require("../../../middlewares/catchAsyncError");

module.exports.signup = catchAsyncError(async (req, res, next) => {
  let isFound = await User.findOne({ email: req.body.email });

  if (isFound) {
    return next(new AppError("email already exist", 409));
  }
  let user = new User(req.body);
  await user.save();
  res.json({ message: "sucess", user });
});

module.exports.signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  let isFound = await User.findOne({ email });
  const match = await bcrypt.compare(password, isFound.password);

  if (isFound && match) {
    let token = jwt.sign(
      {
        name: isFound.name,
        userId: isFound._id,
        role: isFound.role,
      },
      "MgProject"
    );
    return res.json({ message: "sucess", token });
  }
  next(new AppError("incorrect email or password", 401));
});

module.exports.protectedRoutes = catchAsyncError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token)
    return next(new AppError("token not provided (unauthorized)", 401));

  let decoded = await jwt.verify(token, "MgProject");
  // console.log(decoded);

  let user = await User.findById(decoded.userId);
  if (!user) return next(new AppError("invalid token", 401));

  if (user.passwordChangeAt) {
    // console.log(user.passwordChangeAt);
    let changePasswordDate = parseInt(user.passwordChangeAt.getTime() / 1000);
    // console.log(changePasswordDate);
    if (changePasswordDate > decoded.iat)
      return next(new AppError("invalid tokenn", 401));
  }
  req.user = user;
  next();
});
module.exports.allowedTo = (...roles) => {
  // console.log(roles);
  return catchAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "you are not authorized to access this route , you are " +
            req.user.role,
          401
        )
      );
    }
    next();
  });
};

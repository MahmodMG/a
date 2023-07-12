const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const Cart = mongoose.model("Cart");
const Product = mongoose.model("Product");
const Coupon = mongoose.model("Coupon");

function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItems.forEach((elm) => {
    totalPrice += elm.quantity * elm.price;
  });
  cart.totalPrice = totalPrice;
}

module.exports.addProductToCart = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.body.product);
  if (!product) return next(new AppError("product is not found", 401));

  req.body.price = product.price;
  let isCartExist = await Cart.findOne({ user: req.user._id });
  if (!isCartExist) {
    let cart = new Cart({
      user: req.user._id,
      cartItems: [req.body],
    });

    calcTotalPrice(cart);
    await cart.save();
    return res.json({ message: "success", cart });
  }

  let item = isCartExist.cartItems.find(
    (elm) => elm.product == req.body.product
  );

  if (item) {
    item.quantity += req.body.quantity || 1;
  } else {
    isCartExist.cartItems.push(req.body);
  }

  calcTotalPrice(isCartExist);
  if (isCartExist.discount) {
    isCartExist.totalPriceAfterDiscount =
      isCartExist.totalPrice -
      (isCartExist.totalPrice * isCartExist.discount) / 100;
  }
  await isCartExist.save();

  res.status(201).json({ message: "add to cart", cart: isCartExist });
});

module.exports.removeProductFromCart = catchAsyncError(
  async (req, res, next) => {
    let result = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { _id: req.params.id } } },
      {
        new: true,
      }
    );

    !result && next(new AppError("item not found ", 404));
    calcTotalPrice(result);
    if (result.discount) {
      result.totalPriceAfterDiscount =
        result.totalPrice - (result.totalPrice * result.discount) / 100;
    }
    result && res.json({ message: "success", result });
  }
);

module.exports.updateQuantity = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("product is not found", 404));

  let isCartExist = await Cart.findOne({ user: req.user._id });

  let item = isCartExist.cartItems.find((elm) => elm.product == req.params.id);

  if (item) {
    item.quantity = req.body.quantity;
  }
  calcTotalPrice(isCartExist);
  if (isCartExist.discount) {
    isCartExist.totalPriceAfterDiscount =
      isCartExist.totalPrice -
      (isCartExist.totalPrice * isCartExist.discount) / 100;
  }
  await isCartExist.save();

  res.status(201).json({ message: "success", cart: isCartExist });
});

module.exports.applyCoupon = catchAsyncError(async (req, res, next) => {
  let coupon = await Coupon.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  let cart = await Cart.findOne({ user: req.user._id });
  // console.log(cart.totalPrice, coupon.discount);
  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;
  await cart.save();
  res.status(201).json({ message: "success", cart });
});
module.exports.getUserCart = catchAsyncError(async (req, res, next) => {
  let cartItems = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product"
  );

  res.status(201).json({ message: "add to cart", cart: cartItems });
});

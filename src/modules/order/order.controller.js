const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const Order = mongoose.model("Order");
const Product = mongoose.model("Product");
const Cart = mongoose.model("Cart");
const User = mongoose.model("User");
const stripe = require("stripe")(
  "sk_test_51NPTZoCQk2nHhW6u3Lr4RnQWH1TuWmF8wXc2saNS5sLUVRKfscaPCDUFTvVJhQmrkdEbCEnHUEmFRpBwRvpPBget00S6g7dwVU"
);

module.exports.createCashOrder = catchAsyncError(async (req, res, next) => {
  // get cart id
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found", 404));

  // cart total price
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  // creat order
  const order = new Order({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  await order.save();

  if (order) {
    // increment sold & decrement quantity
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { sold: item.quantity, quantity: -item.quantity },
        },
      },
    }));
    await Product.bulkWrite(options);
    // clear user cart
    await Cart.findOneAndDelete({ user: req.user._id });

    return res.status(201).json({ message: "success", order });
  } else {
    return next(new AppError("error in cart id", 404));
  }
});

module.exports.getSpecificOrder = catchAsyncError(async (req, res, next) => {
  let order = await Order.findOne({ user: req.user._id }).populate(
    "cartItems.product"
  );
  res.status(200).json({ message: "success", order });
});

module.exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await Order.find({}).populate("cartItems.product");
  res.status(200).json({ message: "success", orders });
});

module.exports.createCheckOutSession = catchAsyncError(
  async (req, res, next) => {
    const cart = await Cart.findById(req.params.id);

    const totalOrderPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice;
    console.log(totalOrderPrice);
    let session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: req.user.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://www.youtube.com/",
      cancel_url: "https://web.whatsapp.com/",
      customer_email: req.user.email,
      client_reference_id: req.params.id,
      metadata: req.body.shippingAddress,
    });
    res.json({ message: "success", session });
  }
);

module.exports.createOnlineOrder = catchAsyncError(
  async (request, response) => {
    const sig = request.headers["stripe-signature"].toString();

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        "whsec_9TMLNARPynCykeTSZ52NxMn7ifp4sqtX"
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type == "checkout.session.completed") {
      const e = event.data.object;
      // get cart id
      const cart = await Cart.findById(e.client_reference_id);
      if (!cart) return next(new AppError("cart not found", 404));
      let user = await User.findOne({ email: e.customer_email });
      // creat order
      const order = new Order({
        user: user._id,
        cartItems: cart.cartItems,
        totalOrderPrice: e.amount_total / 100,
        shippingAddress: e.metadata,
        paymentType: "card",
        isPaid: true,
        paidAt: Date.now(),
      });
      await order.save();

      if (order) {
        // increment sold & decrement quantity
        let options = cart.cartItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: { sold: item.quantity, quantity: -item.quantity },
            },
          },
        }));
        await Product.bulkWrite(options);
        // clear user cart
        await Cart.findOneAndDelete({ user: user._id });
        console.log("create order here .......");

        return response.status(201).json({ message: "success", order });
      } else {
        return next(new AppError("error in cart id", 404));
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
  }
);

const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: [true, " coupon code is required"],
      unique: true,
    },
    discount: {
      type: Number,
      min: 0,
      required: [true, " coupon discount is required"],
    },
    expires: {
      type: Date,
      required: [true, " coupon Date is required"],
    },
  },
  { timestamps: true }
);

mongoose.model("Coupon", couponSchema);

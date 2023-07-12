const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, " review comment is required"],
    },
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

reviewSchema.pre(["find", "findOne"], function () {
  this.populate("user", "name");
});

mongoose.model("Review", reviewSchema);

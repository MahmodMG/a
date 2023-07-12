const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      // unique: [true, "product name is unique"],
      trim: true,
      required: [true, "product name is required"],
      minLength: [2, "too short product name"],
    },
    slug: { type: String, lowercase: true, required: true },
    price: {
      type: Number,
      required: [true, "product price is required"],
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      minLength: [5, "too short product description"],
      maxLength: [50, "too long product description"],
      required: [true, "product  description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      required: [true, "product  quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    imgCover: String,
    images: [String],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "product  category is required"],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "product  subCategory is required"],
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      required: [true, "product  brand is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.post("init", (doc) => {
  // console.log(doc);
  doc.imgCover = process.env.BASE_URL + "/product/" + doc.imgCover;
  doc.images = doc.images.map(
    (path) => process.env.BASE_URL + "/product/" + path
  );
});

// virtual populate
productSchema.virtual("MyReviews", {
  ref: "Review",
  localField: "_id", // product id
  foreignField: "product",
});

productSchema.pre(["find", "findOne"], function () {
  this.populate("MyReviews");
});

mongoose.model("Product", productSchema);

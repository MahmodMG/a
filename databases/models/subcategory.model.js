const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, " subCategory name is unique"],
      trim: true,
      required: [true, " subCategory name is required"],
      minLength: [2, "too short subCategory"],
    },
    slug: { type: String, lowercase: true, required: true },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

mongoose.model("SubCategory", subCategorySchema);

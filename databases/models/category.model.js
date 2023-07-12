const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, " category name is unique"],
      trim: true,
      required: [true, " category name is required"],
      minLength: [2, "too short category"],
    },
    slug: { type: String, lowercase: true, required: true },
    image: String,
  },
  { timestamps: true }
);

categorySchema.post("init", (doc) => {
  doc.image = process.env.BASE_URL + "/category/" + doc.image;
});
mongoose.model("Category", categorySchema);

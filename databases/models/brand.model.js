const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, " brand name is unique"],
      trim: true,
      required: [true, " brand name is required"],
      minLength: [2, "too short brand name"],
    },
    slug: { type: String, lowercase: true, required: true },

    logo: String,
  },
  { timestamps: true }
);

brandSchema.post("init", (doc) => {
  // console.log(doc);
  doc.logo = process.env.BASE_URL + "/brand/" + doc.logo;
});

mongoose.model("Brand", brandSchema);

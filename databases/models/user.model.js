const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const { string } = require("joi");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, " user name is required"],
      minLength: [2, "too short user name"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, " user email is required"],
      minLength: 1,
      unique: [true, " user email is unique"],
    },
    password: {
      type: String,
      required: [true, " user password is required"],
      minLength: [6, "too short user password"],
    },
    passwordChangeAt: Date,
    phone: {
      type: String,
      required: [true, " user phone is required"],
    },
    profilePic: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],
    addresses: [{ city: String, street: String, phone: String }],
  },
  { timestamps: true }
);
// mongoose middleware pre = before save // post = after save
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 7);
});
userSchema.pre("findOneAndUpdate", function () {
  // console.log(this);
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 7);
  }
});

mongoose.model("User", userSchema);

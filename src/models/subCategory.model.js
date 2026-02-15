const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory Must be unique"],
      minlength: [2, "Too short subCategory name"],
      maxlength: [32, "Too long subCategory name"],
      required: [true, "SubCategory name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory Must belong to Parent Category"],
    },
  },
  { timestamps: true },
);

subCategorySchema.pre("save", function () {
  if (!this.isModified("name")) return;
  this.slug = slugify(this.name, { lower: true });
});

module.exports = mongoose.model("SubCategory", subCategorySchema);

const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand must be unique"],
      minlength: [2, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

brandSchema.pre("save", function () {
  if (!this.isModified("name")) return;
  this.slug = slugify(this.name, { lower: true });
});

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", setImageUrl).post("save", setImageUrl);

module.exports = mongoose.model("Brand", brandSchema);

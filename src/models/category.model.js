const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
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

categorySchema.pre("save", function () {
  if (!this.isModified("name")) return;
  this.slug = slugify(this.name, { lower: true });
});

// Keeps only image name in DB and sends full URL in response
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// Apply image URL middleware on 'init' (find) and 'save' (create/update)
categorySchema.post("init", setImageUrl).post("save", setImageUrl);

module.exports = mongoose.model("Category", categorySchema);

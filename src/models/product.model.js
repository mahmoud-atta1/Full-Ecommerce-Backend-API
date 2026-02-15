const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be less than 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be less than 0"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Discount price cannot be less than 0"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      default: 1,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.pre("save", function () {
  if (!this.isModified("title")) return;
  this.slug = slugify(this.title, { lower: true });
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images && doc.images.length > 0) {
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/products/${image}`,
    );
  }
};

productSchema.post("init", setImageUrl).post("save", setImageUrl);

// Virtual populate: attach product reviews dynamically
// Requires populate("reviews") to be included in queries
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

module.exports = mongoose.model("Product", productSchema);

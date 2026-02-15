const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "Review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", 
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product", 
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true },
);

reviewsSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name profileImg" });
});

// AGGREGATION: Calculate Average Ratings and Quantity
reviewsSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId,
) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRatings,
      ratingsQuantity: stats[0].ratingsQuantity,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// HOOKS: Call aggregation function after save or delete
reviewsSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewsSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
  }
});

module.exports = mongoose.model("Review", reviewsSchema);

const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
// ---------------------------------campgroundを削除したときにreviewも削除されるようにする
// findOneAndDeleteはmongooseのミドルウェア
// app.jsで.campgroundを削除するとき、findByIdAndDeleteを使っているから、findOneAndDeleteをトリガーしている
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);

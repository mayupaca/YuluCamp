const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  // データから対象になるキャンプグラウンドを取得
  const campground = await Campground.findById(req.params.id);
  // review.jsのSchemaからデータが渡ってくるから、req.body.reviewを使ってインスタンスを作る
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Posted Review!!");

  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  // $pull = 配列の特定の条件を満たした要素をremoveする
  const { id, reviewId } = req.params;
  // Campgroundの特定のidのreviewsの特定のreviewIdをpull(引っ張り出す)してupdate
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // pullしたreviewを削除
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted Review!!");
  res.redirect(`/campgrounds/${id}`);
};

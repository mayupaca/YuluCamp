const express = require("express");
// 親のパラメータを使いたい場合はmergeParamsを使う
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ---------------------------------------------------- Campground Review投稿
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    // データから対象になるキャンプグラウンドを取得
    const campground = await Campground.findById(req.params.id);
    // review.jsのSchemaからデータが渡ってくるから、req.body.reviewを使ってインスタンスを作る
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Posted Review!!");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// ---------------------------------------------------- Delete Campground review
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    // $pull = 配列の特定の条件を満たした要素をremoveする
    const { id, reviewId } = req.params;
    // Campgroundの特定のidのreviewsの特定のreviewIdをpull(引っ張り出す)してupdate
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // pullしたreviewを削除
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted Review!!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;

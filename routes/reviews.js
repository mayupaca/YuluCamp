const express = require("express");
// 親のパラメータを使いたい場合はmergeParamsを使う
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");

// ---------------------------------------------------- Campground Review投稿
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
// ---------------------------------------------------- Delete Campground review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;

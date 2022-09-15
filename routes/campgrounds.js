const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  // --------------------------------------------------- All camp site
  .get(catchAsync(campgrounds.index))
  // catchAsync関数(wrapper関数)をutilフォルダーに作って全てのasyncでerrorを使えるようにする
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// --------------------------------------------------- Create New Campsite Form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  // --------------------------------------------------- Campsite detail
  .get(catchAsync(campgrounds.showCampground))
  // ---------------------------------------------------- PUTで飛ばされた変更を受け取る
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  // ---------------------------------------------------- Delete
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//  --------------------------------------------------- Edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//リファクター前
// --------------------------------------------------- All camp site
// router.get("/", catchAsync(campgrounds.index));
// --------------------------------------------------- Create New Campsite Form
// router.get("/new", isLoggedIn, campgrounds.renderNewForm);
// --------------------------------------------------- New formから送られた情報を受け取る
// catchAsync関数(wrapper関数)をutilフォルダーに作って全てのasyncでerrorを使えるようにする
// router.post(
//   "/",
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCampground)
// );
// --------------------------------------------------- Campsite detail
// router.get("/:id", catchAsync(campgrounds.showCampground));
//  --------------------------------------------------- Edit
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.renderEditForm)
// );
// ---------------------------------------------------- PUTで飛ばされた変更を受け取る
// router.put(
//   "/:id",
//   isLoggedIn,
//   isAuthor,
//   validateCampground,
//   catchAsync(campgrounds.updateCampground)
// );
// ---------------------------------------------------- Delete
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.deleteCampground)
// );

module.exports = router;

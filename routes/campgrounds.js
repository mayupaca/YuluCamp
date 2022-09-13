const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// --------------------------------------------------- All camp site
router.get(
  "/",
  catchAsync(async (req, res) => {
    // Campground modelの全データを.findメソッドで取得
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds });
  })
);
// --------------------------------------------------- Create New Campsite Form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
// --------------------------------------------------- New formから送られた情報を受け取る
// catchAsync関数(wrapper関数)をutilフォルダーに作って全てのasyncでerrorを使えるようにする
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // if (req.body.campground) throw new ExpressError("Unexpected campground data.", 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    // 新しいキャンプ場情報をsaveしてからflash
    req.flash("success", "Registered new Campground!!");
    res.redirect(`campgrounds/${campground._id}`);
  })
);
// --------------------------------------------------- Campsite detail
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Can not find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
//  --------------------------------------------------- Edit
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Can not find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
// ---------------------------------------------------- PUTで飛ばされた変更を受け取る
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    //更新したいcampsiteのIDを取得
    const { id } = req.params;
    // Campground Modelから対象のidのbody情報取得
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Updated Campground!!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// ---------------------------------------------------- Delete
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Deleted Campground!!");

    res.redirect("/campgrounds");
  })
);

module.exports = router;

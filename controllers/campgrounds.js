const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  // Campground modelの全データを.findメソッドで取得
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Can not find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.createCampground = async (req, res) => {
  // if (req.body.campground) throw new ExpressError("Unexpected campground data.", 400);
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  // 新しいキャンプ場情報をsaveしてからflash
  req.flash("success", "Registered new Campground!!");
  res.redirect(`campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Can not find that campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  //更新したいcampsiteのIDを取得
  const { id } = req.params;
  // Campground Modelから対象のidのbody情報取得
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Updated Campground!!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Deleted Campground!!");

  res.redirect("/campgrounds");
};

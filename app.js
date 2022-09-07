const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

const app = express();

const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/yulu-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected MongoDB Successfully!!");
  })
  .catch((err) => {
    console.log("Connected Error MongoDB!!");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

// --------------------------------------------------- All camp site
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    // Campground modelの全データを.findメソッドで取得
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
// --------------------------------------------------- Create New Campsite Form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
// --------------------------------------------------- New formから送られた情報を受け取る
// catchAsync関数(wrapper関数)をutilフォルダーに作って全てのasyncでerrorを使えるようにする
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (req.body.campground) throw new ExpressError("Unexpected campground data.", 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
  })
);
// --------------------------------------------------- Campsite detail
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);
//  --------------------------------------------------- Edit
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// ---------------------------------------------------- PUTで飛ばされた変更を受け取る
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    //更新したいcampsiteのIDを取得
    const { id } = req.params;
    // Campground Modelから対象のidのbody情報取得
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// ---------------------------------------------------- Delete
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);
// ---------------------------------------------------- 404を返す
// .all('*') = 全部のCRUDと全path
app.all("*", (req, res, next) => {
  next(new ExpressError("Can not find the page:(", 404));
});

// ---------------------------------------------------- Error handle
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong...";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log("Listening to port 3000...");
});

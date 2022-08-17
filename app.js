const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

// --------------------------------------------------- All camp site
app.get("/campgrounds", async (req, res) => {
  // Campground modelの全データを.findメソッドで取得
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
// --------------------------------------------------- Create New Campsite Form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
// --------------------------------------------------- New formから送られた情報を受け取る
app.post("/campgrounds", async (req, res) => {
  const campground = await Campground(req.body.campground);
  await campground.save();
  res.redirect(`campgrounds/${campground._id}`);
});
// --------------------------------------------------- Campsite detail
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});
//  --------------------------------------------------- Edit
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});
// ---------------------------------------------------- PUTで飛ばされた変更を受け取る
app.put('/campgrounds/:id', async (req, res) => {
  //更新したいcampsiteのIDを取得
  const { id } = req.params;
  // Campground Modelから対象のidのbody情報取得
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
});
// ---------------------------------------------------- Delete
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
})
// ---------------------------------------------------- 
app.listen(port, () => {
  console.log("Listening to port 3000...");
});

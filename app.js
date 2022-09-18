if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");

const mongoSanitize = require("express-mongo-sanitize");

const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/yulu-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
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
// publicディレクトリをexpressで使えるようにする
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const sessionConfig = {
  name: "session",
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    // sessionの有効期限 = maxAge
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
// authenticateはpassportのstatic method
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://api.mapbox.com",
  "https://stackpath.bootstrapcdn.com",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];
const imgSrcUrls = [
  `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
  "https://images.unsplash.com",
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// flashを使って一時的なメッセージの表示
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

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

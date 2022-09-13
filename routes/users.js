const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to YuluCamp!!");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!!");
    res.redirect("/campgrounds");
  }
);

module.exports = router;

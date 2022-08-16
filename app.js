const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yulu-camp',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Connected MongoDB Successfully!!');
    })
    .catch(err => {
        console.log('Connected Error MongoDB!!');
        console.log(err);
    });

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({ title: "My camp site", description: 'Cozy camp' })
  await camp.save();
  res.send(camp)
});


app.listen(port, () => {
  console.log("Listening to port 3000...");
});

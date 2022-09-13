const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  // passport-local Mongooseはusername, hashとsaltを自動に追加する
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

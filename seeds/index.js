const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// データを新しくしたいときはターミナルから node seeds/index.js をして更新してあげないといけない。
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "632087aaef01f21bda91d862",
      location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dqnjhkx4x/image/upload/v1663261769/YuluCamp/jvaptgwg73bnfxmx1tqt.jpg",
          filename: "YuluCamp/jvaptgwg73bnfxmx1tqt",
        },
        {
          url: "https://res.cloudinary.com/dqnjhkx4x/image/upload/v1663261788/YuluCamp/ykzrae91mvkbd3rr8hp4.jpg",
          filename: "YuluCamp/ykzrae91mvkbd3rr8hp4",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

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
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomCityIndex].longitude,
          cities[randomCityIndex].latitude,
        ],
      },
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dqnjhkx4x/image/upload/v1663461276/YuluCamp/x9gn0sna8bkfgmrxvnm0.jpg',
          filename: 'YuluCamp/x9gn0sna8bkfgmrxvnm0'
        },
        {
          url: 'https://res.cloudinary.com/dqnjhkx4x/image/upload/v1663461286/YuluCamp/kndxcynlonpvq3kxz8rp.jpg',
          filename: 'YuluCamp/kndxcynlonpvq3kxz8rp'
        }
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

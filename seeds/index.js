const mongoose = require("mongoose");
const indonesia = require("./indonesia");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground"); //? import models campground.js

// connect to database
mongoose.connect("mongodb://localhost:27017/yelp-camp"),
    {
        useNewUrlParser: true,
        useCreateUrlParser: true,
        useUnifiedTopology: true,
    };

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
// end connect database

// testing connect database + tambah data
const sample = (array) => array[Math.floor(Math.random() * array.length)]; //? logika untuk menambahkan data bersifat array secara random

const testing = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 510);
        const price = Math.floor(Math.random() * 100000) + 1;
        const loremAcak = Math.floor(Math.random() * 30);
        const camp = new Campground({
            author: "65c7235e4dad5863226aa5ca",
            location: `${indonesia[random1000].city}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [indonesia[random1000].longitude, indonesia[random1000].latitude],
            },
            description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi quo animi dolor quae ipsam accusantium culpa aliquid obcaecati? Veritatis maxime quibusdam impedit aperiam ut quae ipsa voluptatem beatae tempora perferendis, autem dicta placeat doloremque aut quasi, explicabo sint sunt deleniti debitis fuga quaerat tempore necessitatibus dolore. Vel iusto quaerat natus!`,
            price: price,
            image: [
                {
                    url: "https://res.cloudinary.com/dflfrprqg/image/upload/v1708414168/YelpCamp/wtcy5zztfihl8r4qjso1.jpg",
                    filename: "YelpCamp/wtcy5zztfihl8r4qjso1",
                },
                {
                    url: "https://res.cloudinary.com/dflfrprqg/image/upload/v1708414171/YelpCamp/ngv6wjflqwp4fwevello.jpg",
                    filename: "YelpCamp/ngv6wjflqwp4fwevello",
                },
            ],
        });
        await camp.save();
    }
};

testing().then(() => {
    mongoose.connection.close();
});
// end testing connect database

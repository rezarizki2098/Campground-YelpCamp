const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

//? cara membuat virtual dengan nama thumbnail dan mengubah URL menjadi yg kita inginkan
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});
const opts = { toJSON: { virtuals: true } }; //? ini digunakan untuk memberikan akses virtual di Schema untuk MAP

const campgroundSchema = new Schema(
    {
        title: String,
        image: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        price: Number,
        location: String,
        description: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `
    <a href="/campgrounds/${this._id}" >${this.title}</a>
    <p>${this.description.substring(0, 30)}...</p>
    `;
});

campgroundSchema.post("findOneAndDelete", async function (data) {
    //? ini adalah cara untuk menghapus data di modul review yang memiliki _id di dalam array reviews
    if (data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews,
            },
        });
    } else {
        console.log("Data Tidak Ditemukan");
    }
});

module.exports = mongoose.model("Campground", campgroundSchema); //? ini adalah model untuk memanggil database

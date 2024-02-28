const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.TOKEN_MAPBOX });
const { cloudinary } = require("../cloudinary/");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map((changeToObject) => ({ url: changeToObject.path, filename: changeToObject.filename })); //? di dalam req.files terdapat banyak nama object dan "files" adalah bawaan dari multer-storage-cloudinary
    console.log(campground);
    campground.author = req.user._id;
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    await campground.save();
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } }) //? cara pemanggilan author yang ada di schema reviews
        .populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id);
    res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((changeToObject) => ({ url: changeToObject.path, filename: changeToObject.filename })); //? ini adalah cara untuk memasukkan data di url: dengan data yang ada di image.path
    campground.image.push(...imgs);
    campground.geometry = geoData.body.features[0].geometry; // ? edit lokasi map
    await campground.save();
    //? cara menghapus image dari database yg di ceklist
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); //? ini cara menghapus image yang ada di database cloudinary
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } }); //? ini cara menghapus image yang ada di mongoodb
        console.log(campground);
    }
    req.flash("success", "Successfully updated");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async function (req, res) {
    //? delete tidak bisa menggunakan fungsi panah
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully delete campground");
    res.redirect("/campgrounds");
};

const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");

//? authentication login
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.originalUrl === "/campgrounds/65addca4ec4df678abb103f7/reviews") {
            req.session.returnTo = "/campgrounds/:id/";
        } else {
            req.session.returnTo = req.originalUrl;
        }
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};

//? urlSesson
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

//? Validate Review Author
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

//? Validate Author
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

//? validate error ketika kita mengisi form kosong
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // const msg = error.details.map((el) => el.message).join(","); //? ini cara lain pemanggilan error
        throw new ExpressError(error.details[0].message, 400);
    } else {
        next();
    }
};

//? validate error ketika kita mengisi form kosong
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // const msg = error.details.map((el) => el.message).join(","); //? ini cara lain pemanggilan error
        throw new ExpressError(error.details[0].message, 400);
    } else {
        next();
    }
};

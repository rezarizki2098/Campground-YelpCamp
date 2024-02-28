const passport = require("passport");

module.exports.verify = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.session.returnTo = req.originalUrl;
            req.flash("error", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash("success", "Successfully logged in");
            return res.redirect("/campgrounds");
        });
    })(req, res, next);
};

// passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }); //? ini cara dasar menggunakan passport authentication

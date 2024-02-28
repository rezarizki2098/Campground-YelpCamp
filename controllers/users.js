const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("user/register");
};

module.exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registiredUser = await User.register(newUser, password);
        req.login(registiredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Selamat datang di campgrounds");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("user/login");
};

module.exports.authenticateLogin = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    // delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out");
        res.redirect("/campgrounds");
    });
};

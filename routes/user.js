// * Library - Library
const express = require("express");
const router = express.Router();
const passport = require("passport");

// * Utils Error ----------------------------------------------------------------
const catchAsync = require("../utils/catchAsync");

// * Middleware ----------------------------------------------------------------
const { storeReturnTo } = require("../middleware");

// * Controller ----------------------------------------------------------------
const { renderRegisterForm, createUser, loginForm, authenticateLogin, logout } = require("../controllers/users");

// Form Register and Create User
router.route("/register").get(renderRegisterForm).post(catchAsync(createUser));
// end Form Register and Create User

// Form Login
router
    .route("/login")
    .get(loginForm)
    //? cara melakukan authentication login menggunakan  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" })"
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), authenticateLogin);
// end Form Login

// Logout
router.get("/logout", logout);
// end Logout

module.exports = router;

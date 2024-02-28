const express = require("express");
const router = express.Router();
const multer = require("multer");

// * Storage Cloudinary --------------------------------
const { storage } = require("../cloudinary");
const upload = multer({ storage }); //? cara penggunaan multer upload image dan di simpan di database cloudinary

// * Controller campgrounds -------------------------------------------------------
const { index, renderNewForm, createCampground, showCampground, renderEditForm, editCampground, deleteCampground } = require("../controllers/campgrounds");

// * Middleware ----------------------------------------------------------------
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");

// * Utils Error----------------------------------------------------------------
const catchAsync = require("../utils/catchAsync");

// index, post
router.route("/").get(catchAsync(index)).post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(createCampground));
// .post(upload.array("image"), (req, res) => { //? upload.array("image") image harus disamakan sama name="" yang ada di input html
//     console.log(req.body, req.files);
//     res.send("Working");
// });
// end index, add, post

// new Campground
router.get("/new", isLoggedIn, renderNewForm);
// end new Campground

// show one data, edit and delete
router
    .route("/:id")
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));
// end show one data, edit and delete

// edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));
// end edit form

module.exports = router;

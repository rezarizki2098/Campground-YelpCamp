const express = require("express");
const router = express.Router({ mergeParams: true });

// * Utils Error ----------------------------------------------------------------
const catchAsync = require("../utils/catchAsync");

// * Middleware ----------------------------------------------------------------
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

// * Controller ----------------------------------------------------------------
const { postReview, deleteReview } = require("../controllers/reviews");

// ADD REVIEWS
router.post("/", isLoggedIn, validateReview, catchAsync(postReview));
// END ADD REVIEWS

// delete the review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview));
// end delete the review

module.exports = router;

const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { validateReview, isloggedin,isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");


// CREATE REVIEW
router.post(
    "/:id/reviews",
    isloggedin,
    validateReview,
    wrapAsync(reviewController.createReview)
);


// DELETE REVIEW
router.delete(
    "/:id/reviews/:reviewId",
    isloggedin,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
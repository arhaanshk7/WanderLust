const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/tempt.js");
const ExpressError = require("../utils/ExpressError.js");

const { validateReview, isloggedin,isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");


// CREATE REVIEW
router.post(
    "/:id/reviews",
    isloggedin,
    validateReview,
    WrapAsync(reviewController.createReview)
);


// DELETE REVIEW
router.delete(
    "/:id/reviews/:reviewId",
    isloggedin,
    isReviewAuthor,
    WrapAsync(reviewController.deleteReview)
);

module.exports = router;
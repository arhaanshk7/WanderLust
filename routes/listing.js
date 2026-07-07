const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateListing } = require("../middleware.js");
const {isloggedin} =  require("../middleware.js");
const{isowner} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });

const { isHost } = require("../middleware.js");
const User = require("../models/user.js");



// ALL LISTINGS
router.get("/", wrapAsync(listingController.index));


// NEW FORM
router.get("/new", isloggedin, listingController.renderNewForm);


router.get("/search",listingController.search);



// SHOW
router.get("/:id", wrapAsync(listingController.show));


// CREATE
router.post(
  "/",
  isloggedin,
  isHost,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.createListing)
);





// EDIT FORM
router.get(
  "/:id/edit",
  isloggedin,
  isowner,
  wrapAsync(listingController.renderEditForm)
);


// UPDATE
router.put(
  "/:id",
  isloggedin,
  isowner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
);


// DELETE
router.delete(
  "/:id",
  isloggedin,
  isowner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
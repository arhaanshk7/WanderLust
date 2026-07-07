const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
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
router.get("/", WrapAsync(listingController.index));


// NEW FORM
router.get("/new", isloggedin, listingController.renderNewForm);


router.get("/search",listingController.search);



// SHOW
router.get("/:id", WrapAsync(listingController.show));


// CREATE
router.post(
  "/",
  isloggedin,
  isHost,
  upload.single("image"),
  validateListing,
  WrapAsync(listingController.createListing)
);





// EDIT FORM
router.get(
  "/:id/edit",
  isloggedin,
  isowner,
  WrapAsync(listingController.renderEditForm)
);


// UPDATE
router.put(
  "/:id",
  isloggedin,
  isowner,
  upload.single("image"),
  validateListing,
  WrapAsync(listingController.updateListing)
);


// DELETE
router.delete(
  "/:id",
  isloggedin,
  isowner,
  WrapAsync(listingController.deleteListing)
);

module.exports = router;
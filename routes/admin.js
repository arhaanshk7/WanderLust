const express = require("express");
const router = express.Router();

const { isloggedin, isAdmin } = require("../middleware");

const adminController = require("../controllers/admin.js");

const wrapAsync = require("../utils/wrapAsync");


// Admin dashboard
router.get(
    "/host-requests",
    isloggedin,
    isAdmin,
    wrapAsync(adminController.adminPage)
);


// Approve host
router.post(
    "/approve/:id",
    isloggedin,
    isAdmin,
    wrapAsync(adminController.approval)
);


// Reject host
router.post(
    "/reject/:id",
    isloggedin,
    isAdmin,
    wrapAsync(adminController.reject)
);


module.exports = router;
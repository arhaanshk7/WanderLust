const express = require("express");
const router = express.Router();

const passport = require("passport");

const { saveredirectUrl, isloggedin } = require("../middleware.js");
const userController = require("../controllers/user");
const User = require("../models/user.js");

const HostRequest = require("../models/hostRequest");


// SIGNUP
router.get("/signup", userController.renderSignup);
router.post("/signup", userController.signup);


// LOGIN
router.get("/login", userController.renderLogin);

router.post(
    "/login",
    saveredirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);



router.get("/become-host",isloggedin,(req,res)=>{
    res.render("users/hostform",{hideSearch:true});
})

router.post("/become-host", isloggedin, async (req,res)=>{

    const newRequest = new HostRequest({
        ...req.body,
        user: req.user._id
    });

    await newRequest.save();

    req.flash("success", "Host request submitted!");
    res.redirect("/listings");
});

router.get("/my-host-status", isloggedin, async (req,res)=>{

    const request = await HostRequest.findOne({ user: req.user._id }).sort({createdAt:-1});

    res.render("users/hostStatus", { request,hideSearch:true });
});

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
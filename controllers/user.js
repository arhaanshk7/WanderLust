const User = require("../models/user");

// SIGNUP FORM
module.exports.renderSignup = (req, res) => {
    res.render("users/signup",{hideSearch:true});
};

// SIGNUP LOGIC
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({
            username,
            email
        });

        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// LOGIN FORM
module.exports.renderLogin = (req, res) => {
    res.render("users/login",{hideSearch:true});
};

// LOGIN SUCCESS CALLBACK
module.exports.login = (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";

    req.flash("success", "Welcome back to Wanderlust");

    delete req.session.redirectUrl;

    res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
};
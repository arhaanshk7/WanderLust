const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js")



const validateListing = (req,res,next)=>{

    const { error } = listingSchema.validate(req.body.listing);

    if(error){
        return next(
            new ExpressError(400,error.details[0].message)
        );
    }

    next();
};


const validateReview = (req,res,next)=>{

    const {error} = reviewSchema.validate(req.body);

    if(error){
        return next(
            new ExpressError(400,error.details[0].message)
        );
    }

    next();
};

 const isloggedin =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","please logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

const isowner =async(req,res,next)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","Not your listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewAuthor = async(req,res,next)=>{
    let { id, reviewId } = req.params;

    let review =await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","Not your review");
        return res.redirect(`/listings/${id}`);

    }
    next();
}



 const saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

const isHost =(req,res,next)=>{
    if(req.user.role!="host"){
        req.flash("error","only hosts can create listings");
        return res.redirect("/listings");
    }
    next();
}
const isAdmin = (req,res,next)=>{

    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }

    if(req.user.role !== "admin"){
        return res.send("Access Denied ❌");
    }

    next();
}


module.exports = {
    validateListing,
    validateReview,
    isloggedin,
    saveredirectUrl,
    isowner,
    isReviewAuthor,
    isHost,
    isAdmin
};
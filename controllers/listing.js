const Listing = require("../models/listing");


// INDEX
module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index", { listings });
};

// SHOW
module.exports.show = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing ,hideSearch:true});
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new",{hideSearch:true});
};

module.exports.search =async(req,res)=>{
  const query = req.query.q;
   let listings;
   if(query){
    listings = await Listing.find({
     location:{
       $regex:query,
      $options:"i"
     }
    });
   }else{
    listings = await Listing.find({});
   }

   res.render("listings/index",{listings});

};

// CREATE
module.exports.createListing = async (req, res) => {

    if(!req.file){
        throw new ExpressError("Image is required",400);
    }

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };

    await newListing.save();

    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/edit", { listing ,hideSearch:true});
};

// UPDATE
module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

    delete req.body.owner;

    let listing = await Listing.findById(id);

    // update text fields
    Object.assign(listing, req.body.listing);

    // update image if user selected a new one
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted");

    res.redirect("/listings");
};
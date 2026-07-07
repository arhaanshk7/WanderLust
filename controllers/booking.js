const Booking = require("../models/booking");
const Listing = require("../models/listing");


// SHOW USER BOOKINGS
module.exports.show = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id,
        status: "confirmed"
    })
    .populate("listing");


    res.render("booking/myBookings", {
        bookings,
        hideSearch: true
    });

};



// SHOW BOOKING FORM
module.exports.bookingForm = async (req, res) => {

    const listing = await Listing.findById(req.params.id);


    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }


    // cannot book own listing
    if(listing.owner.equals(req.user._id)){

        req.flash(
            "error",
            "You cannot book your own listing"
        );

        return res.redirect(`/listings/${listing._id}`);
    }


    res.render("booking/form", {
        listing,
        hideSearch:true
    });

};



// CREATE BOOKING
module.exports.create = async (req,res)=>{

    const listing = await Listing.findById(req.params.id);


    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }



    const existing = await Booking.findOne({

        user:req.user._id,

        listing:listing._id,

        status:"confirmed"

    });


    if(existing){

        req.flash(
            "error",
            "You already booked this listing"
        );

        return res.redirect(`/listings/${listing._id}`);
    }



    const checkIn = new Date(req.body.checkIn);

    const checkOut = new Date(req.body.checkOut);



    const timeDiff = checkOut - checkIn;


    const nights =
    timeDiff / (1000 * 60 * 60 * 24);



    if(nights <= 0){

        req.flash(
            "error",
            "Invalid booking dates"
        );

        return res.redirect(`/listings/${listing._id}`);

    }



    const totalPrice =
    listing.price * nights;



    const booking = new Booking({

        listing:listing._id,

        user:req.user._id,

        checkIn,

        checkOut,

        guests:req.body.guests,

        totalPrice,

        status:"confirmed"

    });



    await booking.save();



    req.flash(
        "success",
        "Booking successful!"
    );


    res.redirect("/bookings/myBookings");

};





// GET BOOKED DATES
module.exports.bookedDates = async(req,res)=>{


    const bookings = await Booking.find({

        listing:req.params.id,

        status:"confirmed"

    });



    let bookedDates=[];



    bookings.forEach((booking)=>{


        let start = new Date(booking.checkIn);

        let end = new Date(booking.checkOut);



        while(start <= end){


            bookedDates.push(
                new Date(start)
            );


            start.setDate(
                start.getDate()+1
            );

        }


    });



    res.json(bookedDates);


};





// HOST BOOKINGS
module.exports.hostBookings = async(req,res)=>{


    const listings = await Listing.find({

        owner:req.user._id

    });



    const listingIds =
    listings.map(l=>l._id);



    const bookings = await Booking.find({

        listing:{
            $in:listingIds
        },

        status:"confirmed"

    })
    .populate("listing")
    .populate("user");



    res.render(
        "booking/hostBookings",
        {
            bookings,
            hideSearch:true
        }
    );


};





// SHOW CANCEL PAGE
module.exports.cancelForm = async(req,res)=>{


    const booking =
    await Booking.findById(req.params.id)
    .populate("listing");



    res.render(
        "booking/cancel",
        {
            booking
        }
    );

};





// CANCEL BOOKING
module.exports.cancel = async(req,res)=>{


    const booking =
    await Booking.findById(req.params.id);



    if(!booking.user.equals(req.user._id)){


        req.flash(
            "error",
            "You cannot cancel this booking"
        );


        return res.redirect(
            "/bookings/myBookings"
        );

    }



    booking.status="cancelled";


    await booking.save();



    req.flash(
        "success",
        "Booking cancelled successfully"
    );


    res.redirect(
        "/bookings/myBookings"
    );


};
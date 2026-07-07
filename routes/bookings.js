const express = require("express");
const router = express.Router();


const {isloggedin} = require("../middleware");

const wrapAsync = require("../utils/wrapAsync.js");


const bookingController =
require("../controllers/booking.js");




// USER BOOKINGS

router.get(
    "/myBookings",
    isloggedin,
    wrapAsync(bookingController.show)
);




// BOOKING FORM

router.get(
    "/:id/book",
    isloggedin,
    wrapAsync(bookingController.bookingForm)
);




// CREATE BOOKING

router.post(
    "/:id/book",
    isloggedin,
    wrapAsync(bookingController.create)
);




// BOOKED DATES FOR CALENDAR

router.get(
    "/:id/booked-dates",
    wrapAsync(bookingController.bookedDates)
);




// HOST BOOKINGS

router.get(
    "/host/bookings",
    isloggedin,
    wrapAsync(bookingController.hostBookings)
);




// CANCEL PAGE

router.get(
    "/:id/cancel",
    isloggedin,
    wrapAsync(bookingController.cancelForm)
);




// CANCEL BOOKING

router.post(
    "/:id/cancel",
    isloggedin,
    wrapAsync(bookingController.cancel)
);



module.exports = router;
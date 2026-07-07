const express = require("express");
const router = express.Router();


const {isloggedin} = require("../middleware");

const wrapAsync = require("../utils/wrapAsync");


const chatController =
require("../controllers/chat.js");




// CREATE OR OPEN CHAT

router.get(
    "/chat/:listingId/:otherUserId",
    isloggedin,
    wrapAsync(chatController.openChat)
);




// CHAT BOX

router.get(
    "/chatbox/:id",
    isloggedin,
    wrapAsync(chatController.chatBox)
);



module.exports = router;
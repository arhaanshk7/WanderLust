const Conversation = require("../models/conversation");
const Message = require("../models/message");



// CREATE OR OPEN CONVERSATION

module.exports.openChat = async (req,res)=>{


    const userId = req.user._id;

    const {
        listingId,
        otherUserId
    } = req.params;



    let conversation = await Conversation.findOne({

        listing: listingId,

        participants:{
            $all:[
                userId,
                otherUserId
            ]
        }

    });



    if(!conversation){


        conversation = await Conversation.create({

            listing: listingId,

            participants:[
                userId,
                otherUserId
            ]

        });


    }



    res.redirect(
        `/chatbox/${conversation._id}`
    );


};







// OPEN CHAT PAGE

module.exports.chatBox = async(req,res)=>{


    const conversation = await Conversation
        .findById(req.params.id)
        .populate("participants");



    const messages = await Message.find({

        conversation:req.params.id

    })
    .populate("sender")
    .sort({
        createdAt:1
    });



    res.render(
        "chat/chat.ejs",
        {

            conversation,

            messages,

            user:req.user,

            hideSearch:true

        }
    );


};
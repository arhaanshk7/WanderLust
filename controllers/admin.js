const HostRequest = require("../models/hostRequest");
const User = require("../models/user");


module.exports.adminPage = async (req,res)=>{

    const requests = await HostRequest
        .find({status:"pending"})
        .populate("user");

    res.render("admin/requests", {
        requests
    });

};



module.exports.approval = async (req,res)=>{

    const request = await HostRequest.findById(req.params.id);

    if(!request){
        req.flash("error","Request not found");
        return res.redirect("/admin/host-requests");
    }


    request.status = "approved";
    await request.save();


    await User.findByIdAndUpdate(
        request.user._id,
        {
            role:"host"
        }
    );


    req.flash(
        "success",
        "User approved as host!"
    );

    res.redirect("/admin/host-requests");

};



module.exports.reject = async(req,res)=>{

    const request = await HostRequest.findById(req.params.id);


    if(!request){
        req.flash("error","Request not found");
        return res.redirect("/admin/host-requests");
    }


    request.status="rejected";

    await request.save();


    req.flash(
        "error",
        "Request rejected"
    );


    res.redirect("/admin/host-requests");

};
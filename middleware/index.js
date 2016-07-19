// all middleware is here
var Beaches = require("../models/beach");
var Comment = require("../models/comment");

var middlewareObj = {
    
    
};

middlewareObj.checkBeachOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Beaches.findById(req.params.id, function(err, foundBeach){
            if(err){
                res.redirect("back")
            } else{
                //does user own the post
                if(foundBeach.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Beach not found.");
                res.redirect("back")
            } else{
                //does user owns the comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that.")
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "To add beaches or make comments, you must be logged in!")
    res.redirect("/login"); 
}

module.exports = middlewareObj;
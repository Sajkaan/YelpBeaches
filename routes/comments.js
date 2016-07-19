var express     = require("express");
var router      = express.Router();
var Beaches     = require("../models/beach");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// comments new
router.get("/beaches/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Beaches.findById(req.params.id, function(err, beach){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {beach: beach});
        }
    });
});

// comments create
router.post("/beaches/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup beach using ID
    Beaches.findById(req.params.id, function(err, beach){
        if(err){
            req.flash("error", "Something went wrong.");
            console.log(err);
            res.redirect("/beaches");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    beach.comments.push(comment);
                    beach.save();
                    req.flash("succes", "Comment added.");
                    res.redirect("/beaches/" + beach._id);
                }
            });
        }
    });
});

//comments edit route
router.get("/beaches/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
        res.redirect("back");
        } else {
            res.render("comments/edit", {beach_id: req.params.id, comment: foundComment});
        }
    });
});

//comment update
router.put("/beaches/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited.");
            res.redirect("/beaches/" + req.params.id);
        }
    });
});

//comment destroy
router.delete("/beaches/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("error", "Comment deleted.");
           res.redirect("/beaches/" + req.params.id);
       }
   });
});

module.exports = router;
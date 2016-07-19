var express    = require("express");
var router     = express.Router();
var Beaches    = require("../models/beach");
var middleware = require("../middleware");


//INDEX-show all beaches
router.get("/beaches", function(req, res){
  // Get all beaches from DB
  Beaches.find({}, function(err, allBeaches){
    if (err) {
      console.log(err);
    }else{
      res.render("beaches/index", {beaches: allBeaches, currentUser: req.user});
    }
  });
});

//CREATE - add new beaches to DB
router.post("/beaches", middleware.isLoggedIn, function(req, res){
   // get data from form and add to beaches array
   var name = req.body.name;
   var image = req.body.image;
	 var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newBeach = {name: name, image: image, description: description, author: author};
   //create a new beach and save to DB
   Beaches.create(newBeach, function(err, newlyCreated){
    if (err) {
      console.log(err);
    }else{
      //redirect back to beaches page
      res.redirect("/beaches");
    }
   });        
});

//NEW - show form to create new beaches
router.get("/beaches/new", middleware.isLoggedIn, function(req, res) {
    res.render("beaches/new");
});

//SHOW - shows info about beaches
router.get("/beaches/:id", function(req, res){
  //find the beach with provided ID
	Beaches.findById(req.params.id).populate("comments").exec(function(err, foundBeach){
		if(err){
			console.log(err);
		}else{
			//render show template with that beach
  		res.render("beaches/show", {beach: foundBeach});
		}
	});
});

//EDIT - beach route
router.get("/beaches/:id/edit", middleware.checkBeachOwnership, function(req, res){
    Beaches.findById(req.params.id, function(err, foundBeach){
        res.render("beaches/edit", {beach: foundBeach});
    });
});


//UPDATE - beach route
router.put("/beaches/:id", middleware.checkBeachOwnership, function(req,res){
    Beaches.findByIdAndUpdate(req.params.id, req.body.beach, function(err, updatedBeach){
       if(err) {
           res.redirect("/beaches");
       } else {
           res.redirect("/beaches/" + req.params.id);
       }
    });
});

//DESTROY - BEACH ROUTE

router.delete("/beaches/:id", middleware.checkBeachOwnership, function(req, res){
   Beaches.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/beaches");
       } else {
           res.redirect("/beaches");
       }
   });
});




// middleware


module.exports = router;
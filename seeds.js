var mongoose = require("mongoose");
var Beach = require("./models/beach");
var Comment = require("./models/comment"); // adresu unjet

var data = [
    {
        name: "Sunset Beach, Oahu",
        image: "http://media.cntraveler.com/photos/5698051378d099fc122487e3/master/pass/Sunset-Beach-Oahu-cr-getty.jpg",
        description: "Well-known for one of the world's best places to watch big wave surfing in winter "
    },
    {
        name: "Honokalani Beach",
        image: "http://media.cntraveler.com/photos/54aab8a6672c13a9488d0625/master/pass/honokalani-beach-maui-hawaii.jpg",
        description: "With its jet-black shore, lapis lazuli waters and thick, jungle-like foliage, Honokalani Beach is a photographer’s dream"
    },
    {
        name: "El Nido, Palawan",
        image: "http://media.cntraveler.com/photos/569806fac58591430b12b10e/master/pass/El-Nido-Palawan-cr-alamy.jpg",
        description: "hockingly, Palawan remains steadily under the radar, even though this is the second year it has ranked #1"
    }
];

function seedDB(){
    //Remove all beaches
    Beach.remove({},function(err){
        if(err) {
            console.log(err);
        }
        console.log("removed beaches");
         // add beaches
        data.forEach(function(seed){
            Beach.create(seed, function(err, beach){
               if(err) {
                   console.log(err)
               } else {
                   console.log("Added Beach");
                   //add few comments
                   Comment.create(
                       {
                           text:"This place is great",
                           author:"Homer"
                       }, function(err, comment){
                           if(err) {
                               console.log(err);
                           } else {
                                beach.comments.push(comment);
                                beach.save();
                                console.log("created new comment")
                           }
                       });
                    }
            });
        });
    });
}


module.exports = seedDB;

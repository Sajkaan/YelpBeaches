var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Beaches        = require("./models/beach"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"), 
    Comment        = require("./models/comment"),
    User           = require("./models/user");
    seedDB         = require("./seeds");

//require routes
var commentRoutes = require("./routes/comments"),
    beachesRoutes = require("./routes/beaches"),
    indexRoutes   = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_beaches_v10");
app.use(bodyParser.urlencoded ({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed DB
//seedDB();

// PASPORT CONFIG
app.use(require("express-session")({
    secret: "The water is wet",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(beachesRoutes);

var server = app.listen(8080, function() {
    console.log('Ready on port %d', server.address().port);
});
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost:27017/the-campground", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Campground.create(
//     {   
//       name: "Mountain Goat's Rest", 
//       image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=60",
//       description: "Beautiful granite hill, no amenities."
       
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Created campground");
//             console.log(campground);
//       }
//     });


//ROUTES

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/index", {campgrounds : allcampgrounds});
       }
    });
    
});

//CREATE - add new campground
app.post("/campgrounds", function(req, res){
    //get data from the form and add campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name : name, image : image, description: desc};
    //Create new campground and push to DB
    Campground.create(newCampground, function(err, createdCampground){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
    });
    
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about the campground
app.get("/campgrounds/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground})
        }
    });
});


//======================
//COMMENTS ROUTES
//======================

app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }
        else {
           res.render("comments/new", {campground: campground}); 
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } 
       else {
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err)
              }
              else{
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id)
              }
          })
       }
    });
    //create new comment
    //connet new comment to campground
    //redirect to campground show page
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Campground server has started!");
});

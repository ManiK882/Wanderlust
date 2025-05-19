if(process.env.NODE_ENV != "production"){
  require('dotenv').config()  
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");//destructuring the object.
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn, isReviewAuthor } = require("./middleware.js");
const { showListing } = require("./controllers/listings.js");
const {deleteReview} = require("./controllers/reviews.js");
const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dbUrl)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session store",error)
})
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

// app.get("/", (req, res) => {
//     res.send("hi i am root");
// })

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"abc@123",
//         username:"abc"
//     })
//     const registeredUser = await User.register(fakeUser,"hello");
//     res.send(registeredUser);
// })




//show route
app.get("/listing/:id", wrapAsync(showListing));

app.delete("/listings/:id/reviews/:reviewId",
    isLoggedIn,
   isReviewAuthor,
    wrapAsync(deleteReview));

app.use("/listings",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
// app.post("*", (req, res) => {
//     console.log("Caught a POST to:", req.originalUrl);
//     res.send("Post received");
// });

// error handling middleware.
app.use((err, req, res, next) => {
    // let {statusCode = 500,message = "something went wrong"} = err;
    console.log(err.message,err);
    res.render("error.ejs",{err});
    //res.status(statusCode).send(message);
})
app.listen(8080, () => {
    console.log("server listing");
})
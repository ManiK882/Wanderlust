const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");//destructuring the object.
const {reviewSchema} = require("./schema.js");//destructuring the object.
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    console.log("originalpath",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error",'you must be logged in to create listing!');
        res.redirect("/login");
    }
next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) =>{
    let { id } = req.params;
    let listedOwner =  await Listing.findById(id);
    if(res.locals.currUser && !listedOwner.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports. validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body,{ abortEarly: false });
    
    console.log("validate error",error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports. validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    
    console.log("validate error",error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) =>{
    let { id,reviewId } = req.params;
    let review =  await Review.findById(reviewId);
    console.log("user id",res.locals.curruser);
    console.log("review author",review.author);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
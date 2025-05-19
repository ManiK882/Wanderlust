const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res) =>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log('Listing found:', listing);
    console.log('Review to be added:', newReview);
    req.flash("success","New review created");
    res.redirect(`/listing/${listing._id}`);   
}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(reviewId);
     let dr = await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
     console.log(dr);
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
    res.redirect(`/listing/${id}`);
}
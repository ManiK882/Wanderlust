const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn} = require("../middleware.js");
const { createReview } = require("../controllers/reviews.js");

router.post("/",
    isLoggedIn,
    validateReview,wrapAsync(createReview))


module.exports = router;
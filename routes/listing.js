const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const { index, renderNewForm, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})
router
.route("/")
.get( wrapAsync(index))
.post( isLoggedIn,//create route
    
    upload.single('listing[image]'),validateListing,
    wrapAsync(createListing));



//new route
router.get("/new", isLoggedIn,renderNewForm)


router
.route("/:id")
.put( //update route
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(updateListing))
.delete(//delete route
    isLoggedIn,
    isOwner,
    wrapAsync(deleteListing))

//edit route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm))




module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { singUp, logIn, renderSignUpForm, renderLogInForm, logOut } = require("../controllers/users.js");


router.get("/signup",renderSignUpForm);

router.post("/signup", wrapAsync(singUp));

router.get("/login",renderLogInForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    wrapAsync(logIn))

router.get("/logout", logOut);
module.exports = router;
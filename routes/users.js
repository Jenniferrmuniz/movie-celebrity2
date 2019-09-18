const express = require('express');
const router = express.Router();
const User = require('../models/user');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require('bcryptjs');



router.get('/signup', (req, res, next) => {
    res.render('users/signup');
})


router.post('/signup', (req, res, next) => {

    const username = req.body.theUsername;
    const password = req.body.thePassword;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = {
        username: username,
        password: hashPassword
    }

    User.create(newUser)
        .then((data) => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err);
        })
})


router.get('/login', (req, res, next) => {
    res.render('users/login');
})


router.post('/login', (req, res, next) => {

    const username = req.body.theUsername;
    const password = req.body.thePassword;

    User.findOne({ username: username })
        .then((userFromDB) => {

            if (!userFromDB) {


                req.flash('error', 'sorry this username does not exist');

                res.redirect('/users/login');
            }

            if (bcrypt.compareSync(password, userFromDB.password)) {
                // Save the login in the session!
                req.session.currentUser = userFromDB;
                // this is the magic ^ line of code that actually logs you in
                res.redirect("/");
            }
            else {
                req.flash('error', 'incorrect password');
                res.redirect('/users/login')
            }
        })
        .catch((err) => {
            next(err);
        })
})




router.post('/logout', (req, res, next) => {

    req.session.destroy();

    res.redirect('/');

})


router.get('/secret', (req, res, next) => {

    if (req.session.currentUser) {
        res.render('users/secret', { theUser: req.session.currentUser })
    }
    else {
        res.redirect('/')
    }



})


module.exports = router;